import { compare } from "bcryptjs";
import db from "../models/index";
require("dotenv").config();
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
const Sequelize = require("sequelize");
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import _ from 'lodash';
const { Op } = require("sequelize");
let postNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // || !data.descriptionHTML || !data.descriptionMarkdown
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.nameEn ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.address ||
        !data.addressEn
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        await db.Clinics.create({
          name: data.name,
          nameEn: data.nameEn,
          address: data.address,
          addressEn: data.addressEn,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "Save patient booking success",
          // data: data
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getAllClinics = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinics = await db.Clinics.findAll({});
      if (clinics) {
        clinics.forEach((element) => {
          if (element.image) {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          }
        });
      }
      resolve({
        errCode: 0,
        data: clinics,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailClinicInAccountantSide = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Clinics.findOne({
          where: {
            id: id,
          },
          attributes: [
            "descriptionHTML",
            "descriptionMarkdown",
            "name",
            "nameEn",
            "address",
            "addressEn",
            "image",
            "id",
          ],
        });
        if (data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (data) {
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            data: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Clinics.findOne({
          where: {
            id: id,
          },
          attributes: [
            "descriptionHTML",
            "descriptionMarkdown",
            "name",
            "nameEn",
            "address",
            "addressEn",
            "image",
          ],

          include: [
            {
              model: db.Doctor_Infor,
              as: "clinicData",
              attributes: { exclude: ["count"] },
            },
          ],
        });
        if (data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (data) {
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            data: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "missing parametter",
        });
      } else {
        await db.Clinics.destroy({
          where: {
            id: id,
          },
        });
        resolve({
          errCode: 0,
          errMessage: "Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let checkMedicineCode = (medicineCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!medicineCode) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Medicine.findOne({
          where: {
            medicineCode: medicineCode,
          },
        });
        if (data) {
          resolve({
            errCode: 0,
            result: true,
          });
        } else {
          resolve({
            errCode: 0,
            result: false,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let warningDuplicateMedicine = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let arrMedicine = data;
        let warningDuplicateMedicine = new Array();
        if (arrMedicine) {
          for (const medicine of arrMedicine) {
            let res = await checkMedicineCode(medicine.medicineCode);
            if (res && res.result === true) {
              warningDuplicateMedicine.push(medicine.medicineCode);
            }
          }
        }
        if (warningDuplicateMedicine.length > 0) {
          resolve({
            errCode: 0,
            data: {
              result: true,
              warningDuplicateMedicine: warningDuplicateMedicine,
            },
          });
        } else {
          resolve({
            errCode: 0,
            data: {
              result: false,
            },
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let addNewMedicine = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let arrMedicine = data.arrMedicine;
        arrMedicine.map((element) => {
          element.clinicId = data.clinicId;
        });
        if (arrMedicine.length > 1) {
          await db.Medicine.bulkCreate(arrMedicine);
        } else {
          db.Medicine.create(arrMedicine[0]);
        }
        resolve({
          errCode: 0,
          errMessage: "Save medicine success",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getMedicineByClinicId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Medicine.findAll({
          where: {
            clinicId: id,
          },
        });
        if (data) {
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            data: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteMedicineById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "missing parametter",
        });
      } else {
        await db.Medicine.destroy({
          where: {
            id: id,
          },
        });
        resolve({
          errCode: 0,
          errMessage: "Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let editMedicineInfor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.nameMedicine || !data.unit || !data.price) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let medicine = await db.Medicine.findOne({
          where: { id: data.id },
        });
        if (medicine) {
          medicine.nameMedicine = data.nameMedicine;
          medicine.unit = data.unit;
          medicine.price = data.price;
          medicine.medicineCode = data.medicineCode;
          await medicine.save();
          resolve({
            errCode: 0,
            errMessage: "Success",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getMedicineById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Medicine.findOne({
          where: {
            id: id,
          },
        });
        if (data) {
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            data: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateClinicData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.imageBase64 ||
        !data.nameEn ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.address ||
        !data.addressEn
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }
      let clinic = await db.Clinics.findOne({
        where: { id: data.id },
      });
      if (clinic) {
        clinic.name = data.name;
        clinic.nameEn = data.nameEn;
        clinic.address = data.address;
        clinic.descriptionHTML = data.descriptionHTML;
        clinic.descriptionMarkdown = data.descriptionMarkdown;
        clinic.address = data.address;
        clinic.addressEn = data.addressEn;
        clinic.image = data.imageBase64;
        await clinic.save();
        resolve({
          errCode: 0,
          errMessage: "Updated",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Clinic not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllDoctorOfClinic = (clinicId, specialtyCode, positionCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId && !specialtyCode && !positionCode) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Doctor_Infor.findAll({
          where: {
            clinicId: clinicId,
          },
          include: [{ model: db.User, attributes: [] }],
          attributes: [
            [Sequelize.literal("`User`.`email`"), "UserEmail"],
            [Sequelize.literal("`User`.`firstName`"), "firstName"],
            [Sequelize.literal("`User`.`lastName`"), "lastName"],
            [Sequelize.literal("`User`.`address`"), "address"],
            [Sequelize.literal("`User`.`phoneNumber`"), "phoneNumber"],
            [Sequelize.literal("`User`.`image`"), "image"],
            [Sequelize.literal("`User`.`positionId`"), "positionId"],
            [Sequelize.literal("`User`.`gender`"), "gender"],
            [Sequelize.literal("`User`.`id`"), "id"],
            "clinicId",
            "nameSpecialty",
            "specialtyId",
            "count",
            "priceId",
            "note",   
            "doctorId"
          ],
          exclude: [{ model: db.User }],
          raw: true,
          // nest: true,
        });
        if (specialtyCode !== "All") {
          if (data && data.length > 0) {
            data = data.filter((element) => {
              return element.specialtyId === specialtyCode;
            });
          }
        }
        if(positionCode!=='All')
        {
          if (data && data.length > 0) {
            data=data.filter((element) =>{
              return element.positionId.toString()===positionCode;
            });
          }
        }
        if (data && data.length > 0) {
          data.map((element) => {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          });
        }
        if (data) {
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            data: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let bulkCreateSchedulesForDoctors = (data) => {
  return new Promise(async (resolve, reject) => {
      try {
          if (!data.arrSchedule || !data.clinicId) {
              resolve({
                  errCode: 1,
                  errMessage: 'Missing required parameters'
              })
          }
          else {
              let schedule=data.arrSchedule
              await db.schedules_for_clinic.bulkCreate(schedule)
              resolve({
                  errCode: 0,
                  errMessage: 'OKK'
              })
          }
      } catch (e) {
          reject(e);
      }
  })
}
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let createNewDoctorForClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used.Try another one",
        });
      } else {
        let hashPasswordfrromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordfrromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: "R2",
          positionId: data.positionId,
          image: data.avatar,
          clinicId: data.clinicId,
        });
        let userId = await db.User.findOne({
          where: {
            email: data.email,
          },
          attributes: ["id"],
        });
        let specialtyData=await db.Specialty.findOne({
          where:{id:data.specialtyId}
        })
        await db.Doctor_Infor.create({
          doctorId: userId.id,
          specialtyId: data.specialtyId,
          clinicId: data.clinicId,
          count: data.count,
          note:data.note,
          priceId:data.selectedPrice,
          nameSpecialty:specialtyData.name,
          nameSpecialtyEn:specialtyData.nameEn
        });
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let editDoctorClinicInfor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      let doctorInfor = await db.Doctor_Infor.findOne({
        where: {
          doctorId: data.id,
        },
      });
      let specialtyData=await db.Specialty.findOne({
        where:{id:data.specialtyId}
      })
      if (doctorInfor) {
        doctorInfor.specialtyId = data.specialtyId;
        doctorInfor.count = data.count;
        doctorInfor.nameSpecialty=specialtyData.name;
        doctorInfor.nameSpecialtyEn=specialtyData.nameEn;
        doctorInfor.priceId=data.selectedPrice;
        doctorInfor.note=data.note;
        doctorInfor.clinicId=data.clinicId;
        await doctorInfor.save();
      }
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phoneNumber = data.phoneNumber;
        user.image = data.avatar;
        user.clinicId = data.clinicId;
        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Updated",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteDoctorClinic = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    let doctorInfor = await db.Doctor_Infor.findOne({
      where: {
        doctorId: userId,
      },
    });
    if (!user && !doctorInfor) {
      resolve({
        errCode: 2,
        errMessage: "This user is not exist",
      });
    }
    await user.destroy({
      where: { id: userId },
    });
    await doctorInfor.destroy({
      where: { doctorId: userId },
    });

    resolve({
      errCode: 0,
      message: "Completed",
    });
  });
};
let getExtraInforSpecialtyClinic = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.ClinicSpecialty.findOne({
          where: {
            id: specialtyId,
          },
          include:[
            {
              model: db.Allcode,
              as: "priceDataForHospital",
              attributes: ["valueEn", "valueVi"],
            },
          ]
        });
        if(data)
        {
          data.image=new Buffer(data.image, "base64").toString(
            "binary"
          );
        }
        if (data) {
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            data: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  bulkCreateSchedulesForDoctors:bulkCreateSchedulesForDoctors,
  postNewClinic: postNewClinic,
  getAllClinics: getAllClinics,
  getDetailClinicById: getDetailClinicById,
  deleteClinicById: deleteClinicById,
  updateClinicData: updateClinicData,
  addNewMedicine: addNewMedicine,
  getMedicineByClinicId: getMedicineByClinicId,
  deleteMedicineById: deleteMedicineById,
  editMedicineInfor: editMedicineInfor,
  getMedicineById: getMedicineById,
  warningDuplicateMedicine: warningDuplicateMedicine,
  checkMedicineCode: checkMedicineCode,
  getDetailClinicInAccountantSide: getDetailClinicInAccountantSide,
  getAllDoctorOfClinic: getAllDoctorOfClinic,
  createNewDoctorForClinic:createNewDoctorForClinic,
  editDoctorClinicInfor:editDoctorClinicInfor,
  deleteDoctorClinic:deleteDoctorClinic,
  getExtraInforSpecialtyClinic:getExtraInforSpecialtyClinic
};
