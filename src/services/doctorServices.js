import db from "../models/index";
require("dotenv").config();
import sendEmailSimple from "./emailServices";
const Sequelize = require("sequelize");
// import { Sequelize, Model, DataTypes } from 'sequelize';
import "core-js/actual";

// const sequelize = new Sequelize('sqlite::memory:');
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
import _ from "lodash";
import moment from "moment/moment";
const { Op } = require("sequelize");
// const  ClinicSchedules  = require('../../models/Product/order')(sequelize, DataTypes);
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findAll({
        limit: 10,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: false,
        nest: true,
      });
      if (user) {
        user.forEach((element) => {
          if (element.image) {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          }
        });
        // data.image = new Buffer(data.image, 'base64').toString('binary');
      }
      resolve({
        errCode: 0,
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getAllDoctors = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.authRole === "R1") {
        let doctors = await db.User.findAll({
          where: { roleId: "R2" },
          attributes: {
            exclude: ["password"],
          },
        });
        if (doctors) {
          doctors.forEach((element) => {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          });
          // data.image = new Buffer(data.image, 'base64').toString('binary');
        }
        resolve({
          errCode: 0,
          data: doctors,
        });
      } else if (req.authRole === "R2") {
        let doctors = await db.User.findOne({
          where: { id: req.authId },
          attributes: {
            exclude: ["password"],
          },
        });
        if (doctors) {
          // doctors.forEach(element => {
          //     element.image = new Buffer(element.image, 'base64').toString('binary');
          // });
          doctors.image = new Buffer(doctors.image, "base64").toString(
            "binary"
          );
        }
        resolve({
          errCode: 0,
          data: [doctors],
        });
      } else {
        resolve({
          errCode: 0,
          data: {},
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getDoctorForReview = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.authRole === "R1") {
        let doctors = await db.User.findAll({
          where: { roleId: "R2" },
          attributes: {
            exclude: ["password"],
          },
        });
        if (doctors) {
          doctors.forEach((element) => {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          });
          // data.image = new Buffer(data.image, 'base64').toString('binary');
        }
        resolve({
          errCode: 0,
          data: doctors,
        });
      } else if (req.authRole === "R2") {
        let doctors = await db.User.findOne({
          where: { id: req.authId },
          attributes: {
            exclude: ["password"],
          },
        });
        if (doctors) {
          // doctors.forEach(element => {
          //     element.image = new Buffer(element.image, 'base64').toString('binary');
          // });
          doctors.image = new Buffer(doctors.image, "base64").toString(
            "binary"
          );
        }
        resolve({
          errCode: 0,
          data: [doctors],
        });
      } else {
        resolve({
          errCode: 0,
          data: {},
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let validateInputDataArray = (inputData) => {
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "addressClinic",
    "note",
    "descriptionNONHTML",
    "description",
    "selectedClinic",
    "selectedSpecialty",
  ];
  let element = "";
  let isValid = true;
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};
let saveDetailedInfor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let validateInput = validateInputDataArray(inputData);
      if (validateInput.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter ${validateInput.element}!`,
        });
      } else {
        let isExist = await db.Markdown.findOne({
          where: { doctorId: inputData.doctorId },
        });
        if (!isExist) {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            descriptionNONHTML: inputData.descriptionNONHTML,
            doctorId: inputData.doctorId,
          });
        } else {
          isExist.contentHTML = inputData.contentHTML;
          isExist.contentMarkdown = inputData.contentMarkdown;
          isExist.description = inputData.description;
          isExist.descriptionNONHTML = inputData.descriptionNONHTML;
          isExist.updateAt = new Date();
          await isExist.save();
        }

        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });
        if (doctorInfor) {
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.nameSpecialty = inputData.nameSpecialty;
          doctorInfor.clinicId = inputData.selectedClinic;
          doctorInfor.specialtyId = inputData.selectedSpecialty;
          doctorInfor.note = inputData.note;
          doctorInfor.count = inputData.count;
          doctorInfor.updateAt = new Date();
          await doctorInfor.save();
          resolve({
            errCode: 2,
            errMessage: "update a doctor infor for doctor successfully",
          });
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,
            addressClinic: inputData.addressClinic,
            nameClinic: inputData.nameClinic,
            nameSpecialty: inputData.nameSpecialty,
            note: inputData.note,
            count: inputData.count,
            clinicId: inputData.selectedClinic,
            specialtyId: inputData.selectedSpecialty,
          });
          resolve({
            errCode: 0,
            errMessage: "create a doctor infor for doctor successfully",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getDetailedDoctorById = (idInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: idInput,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: [
                "description",
                "contentHTML",
                "contentMarkdown",
                "descriptionNONHTML",
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
              // attributes: ['description', 'contentHTML', 'contentMarkdown']
            },
          ],
          raw: false,
          nest: true,
        });
        console.log('data checker',data)
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        } else data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllMarkdown = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Markdown.findAll();
      resolve({
        errCode: 0,
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: {
            doctorId: data.doctorId,
          },
        });
        // await db.Schedule.destroy({
        //   where: {
        //     doctorId: data.doctorId,
        //     date: data.date,
        //     maxNumber: {
        //       [Op.eq]: doctorInfo.count,
        //     },
        //   },
        // });

        let schedule = data.arrSchedule;
        schedule = schedule.map((item) => {
          item.maxNumber = doctorInfo.count
            ? doctorInfo.count
            : MAX_NUMBER_SCHEDULE;
          item.currentNumber = 0;
          return item;
        });
        console.log('sao loi quai v 389')
        await db.Schedule.bulkCreate(schedule);
        console.log('sao loi quai v 391')

        resolve({
          errCode: 0,
          errMessage: "OKK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getSelectedScheduleById = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId && !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId && !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        console.log(date);
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
        });
        console.log('checkdoctor', doctorInfo)
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            currentNumber: {
              [Op.lt]: doctorInfo?.count,
            },
          },
          include: [
            {
              model: db.Allcode,
              as: "timetypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getScheduleByDateContainUserId = (doctorId, date, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId && !date && !userId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
        });
        console.log('Found',doctorInfo)

        let userScheduleForDate = await db.Booking.findAll({
          where: {
            patientId: userId,
            date: date,
          },
        });
        console.log('Found',userScheduleForDate)

        if (userScheduleForDate === []) {
          let dataSchedule = await db.Schedule.findAll({
            where: {
              doctorId: doctorId,
              date: date,
              currentNumber: {
                [Op.lt]: doctorInfo.count,
              },
            },
            include: [
              {
                model: db.Allcode,
                as: "timetypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.User,
                as: "doctorData",
                attributes: ["firstName", "lastName"],
              },
            ],
          });
          if (!dataSchedule) dataSchedule = [];
          resolve({
            errCode: 0,
            data: dataSchedule,
          });
        } else {
          let dataSchedule = await db.Schedule.findAll({
            where: {
              doctorId: doctorId,
              date: date,
            },
            include: [
              {
                model: db.Allcode,
                as: "timetypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.User,
                as: "doctorData",
                attributes: ["firstName", "lastName"],
              },
            ],
            attributes: [
              "id",
              "currentNumber",
              "date",
              "doctorId",
              "picked_date",
              "timetype",
            ],
          });
          console.log('checkkkkkkk',dataSchedule)
          if (!dataSchedule) dataSchedule = [];
          for (const element of dataSchedule) {
            let check = userScheduleForDate.find(
              (e) => e.timeType === element.timetype
            );
            if (check && check.id !== null) {
              if (element.currentNumber === doctorInfo.count) {
                element.dataValues.bookedButFull = true;
              } else element.dataValues.bookedByThisUser = true;
            } else {
              element.dataValues.bookedByThisUser = false;
            }
          }
          resolve({
            errCode: 0,
            data: dataSchedule,
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let deleteSelectedSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    let schedule = await db.Schedule.findOne({
      where: { id: data },
    });

    if (!schedule) {
      resolve({
        errCode: 2,
        errMessage: "This user is not exist",
      });
    }
    await schedule.destroy({
      where: { id: data },
    });
    resolve({
      errCode: 0,
      message: "Completed",
    });
  });
};
let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Specialty,
              as: "specialtyData",
              attributes: ["name", "nameEn"],
            },
            {
              model: db.Clinics,
              as: "clinicData",
              attributes: ["name", "nameEn", "address", "addressEn"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getProfileDoctorById = (doctorId, checkModal) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        if (checkModal === false) {
          let data = await db.User.findOne({
            where: {
              id: doctorId,
            },
            attributes: {
              exclude: ["password"],
            },
            include: [
              {
                model: db.Markdown,
                attributes: ["description"],
              },
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Doctor_Infor,
                attributes: {
                  exclude: ["id", "doctorId"],
                },
                include: [
                  {
                    model: db.Allcode,
                    as: "priceData",
                    attributes: ["valueEn", "valueVi"],
                  },
                  {
                    model: db.Allcode,
                    as: "paymentData",
                    attributes: ["valueEn", "valueVi"],
                  },
                  {
                    model: db.Allcode,
                    as: "provinceData",
                    attributes: ["valueEn", "valueVi"],
                  },
                ],
              },
            ],
            raw: false,
            nest: true,
          });

          if (data) {
            if (data.image) {
              data.image = new Buffer(data.image, "base64").toString("binary");
            }
          } else data = {};
          resolve({
            errCode: 0,
            data: data,
          });
        } else {
          console.log("checkModal", checkModal);
          let doctors = await db.User.findOne({
            where: { id: doctorId },
            attributes: {
              exclude: ["password"],
            },
            include: [
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Doctor_Infor,
                attributes: ["addressClinic", "nameClinic", "nameSpecialty"],
              },
              {
                model: db.Doctor_Clinic_Specialty,
                attributes: ["clinicId", "specialtyId"],
                include: [
                  {
                    model: db.ClinicSpecialty,
                    attributes: ["location", "name"],
                    as: "specialtyData",
                  },
                ],
              },
            ],
          });
          console.log("Doctor", doctors)
          if (doctors) {
            // doctors.forEach(element => {
            //     element.image = new Buffer(element.image, 'base64').toString('binary');
            // });
            doctors.image = new Buffer(doctors.image, "base64").toString(
              "binary"
            );
          }
          // let data = await db.User.findOne({
          //   where: {
          //     id: doctorId,
          //   },
          //   // attributes: {
          //   //   exclude: ["password","address","email","gender"],
          //   // },
          //   // include: [
          //   //   {
          //   //     model: db.Allcode,
          //   //     as: "positionData",
          //   //     attributes: ["valueEn", "valueVi"],
          //   //   },
          //   // ],
          //   // raw: false,
          //   // nest: true,
          // });
          // if (data) {
          //   if (data.image) {
          //     data.image = new Buffer(data.image, "base64").toString("binary");
          //   }
          // } else data = {};
          // if (data && data.image) {
          //     data.image = new Buffer(data.image, 'base64').toString('binary');
          // }
          // if (!data) data = {}
          console.log('check docorr',doctors)
          resolve({
            errCode: 0,
            data: doctors,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataBooking = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
        });
        resolve({
          errCode: 0,
          data: dataBooking,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getListExaminatedPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataBooking = await db.Booking.findAll({
          where: {
            statusId: "S3",
            doctorId: doctorId,
            date: date,
          },
        });

        resolve({
          errCode: 0,
          data: dataBooking,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let postHistoryPatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.medicalRecords) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
          data: data,
        });
      } else {
        let bookinginfo = await db.Booking.findOne({
          where: {
            id: data.bookingId,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email"],
            },
            {
              model: db.User,
              as: "doctorInfoData",
              attributes: ["email", "lastName", "firstName"],
            },
          ],
        });
        if (bookinginfo) {
          console.log(data);
          await db.History.create({
            bookingId: data.bookingId,
            medicalRecords: data.medicalRecords,
            medicineRange: data.medicineRange,
            date: data.date,
          }).then(async function (x) {
            let dataReceipt = data.receipts.map((item) => {
              item.historyId = x.id;
              return item;
            });
            await db.Receipt.bulkCreate(dataReceipt);
            resolve({
              errCode: 0,
              errMessage: "create history success",
              bookinginfo,
            });
          });
          await db.Booking.update(
            {
              statusId: "S3",
            },
            {
              where: {
                id: data.bookingId,
              },
            }
          );

          await sendEmailSimple.sendEmailHistoryToPatient({
            receiverMail: bookinginfo.patientData.email,
            patientName: bookinginfo.forWho,
            time: bookinginfo.bookingDate,
            doctorName: `${bookinginfo.doctorInfoData.lastName} ${bookinginfo.doctorInfoData.firstName}`,
            receipts: data.receipts,
            medicalRecords: data.medicalRecords,
            medicineRange: data.medicineRange,
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "booking notfound",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getHistoryPatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let historyInfo = await db.History.findOne({
          where: {
            bookingId: data,
          },
          include: [
            {
              model: db.Receipt,
              as: "receiptData",
              attributes: {
                exclude: ["id", "historyId"],
              },
            },
            // {
            //   model: db.Booking,
            //   attributes: ["doctorId"],
            //   include: [
            //     {
            //       model: db.User,
            //       as: "doctorInfoData",
            //       attributes: ["email", "firstName", "lastName", "image", "id"],
            //         {
            //           model: db.Doctor_Infor,
            //           attributes: {
            //             exclude: ["id", "doctorId"],
            //           },
            //         },
            //       ],
            //     },
            //   ],
            // },
          ],
        });
        if (historyInfo) {
          resolve({
            errCode: 0,
            historyInfo: historyInfo,
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "booking notfound",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getHistoryPatientByDate = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let historyInfo = await db.History.findAll({
          where: {
            date: data,
          },
          include: [
            {
              model: db.Receipt,
              as: "receiptData",
              attributes: {
                exclude: ["id", "historyId"],
              },
            },
            {
              model: db.Booking,
              attributes: ["doctorId"],
              include: [
                {
                  model: db.User,
                  as: "doctorInfoData",
                  attributes: ["email", "firstName", "lastName", "image", "id"],
                  include: [
                    {
                      model: db.Doctor_Infor,
                      attributes: {
                        exclude: ["id", "doctorId"],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        });
        console.log(historyInfo);
        if (historyInfo) {
          resolve({
            errCode: 0,
            data: historyInfo,
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "booking notfound",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getRatingDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let ratingInfo = await db.Rating.findAll({
          where: {
            doctorId: data,
          },
          raw: true,
          nest: true,
          include: [
            {
              model: db.Booking,
              attributes: ["patientId"],
              include: [
                {
                  model: db.User,
                  as: "patientData",
                  attributes: [
                    "email",
                    "firstName",
                    "lastName",
                    "image",
                    "id",
                    "gender",
                  ],
                },
              ],
            },
          ],
        });

        if (ratingInfo) {
          ratingInfo.forEach((element) => {
            if (element.Booking.patientData.image) {
              element.Booking.patientData.image = new Buffer(
                element.Booking.patientData.image,
                "base64"
              ).toString("binary");
            }
          });
          // ratingInfo.Booking.patientData.image = new Buffer(users.image, 'base64').toString('binary');
        }
        if (ratingInfo) {
          var result = await ratingInfo.map(function (el) {
            var o = Object.assign({}, el);
            let firstDate = new Date(el.updatedAt),
              secondDate = new Date(),
              timeDifference = Math.abs(
                secondDate.getTime() - firstDate.getTime()
              );
            let differentDays = Math.floor(timeDifference / (1000 * 3600 * 24));
            let sothang = parseInt(differentDays / 30);
            let songay = differentDays;
            o.songay = songay;
            o.sothang = sothang;
            return o;
          });
          resolve({
            errCode: 0,
            ratingInfo: result,
          });
        } else {
          resolve({
            errCode: 1,
            ratingInfo: ratingInfo,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getScheduleByDateFromDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId && !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
        });
        if (doctorInfo) {
          let dataSchedulenobooking = await db.Schedule.findAll({
            where: {
              doctorId: doctorId,
              date: date,
              currentNumber: {
                [Op.eq]: 0,
              },
            },
            include: [
              {
                model: db.Allcode,
                as: "timetypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.User,
                as: "doctorData",
                attributes: ["firstName", "lastName"],
              },
            ],
          });
          if (!dataSchedulenobooking) dataSchedulenobooking = [];

          let dataSchedulebooked = await db.Schedule.findAll({
            where: {
              doctorId: doctorId,
              date: date,
              currentNumber: {
                [Op.and]: {
                  [Op.lt]: doctorInfo.count,
                  [Op.gt]: 0,
                },
              },
            },
            include: [
              {
                model: db.Allcode,
                as: "timetypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.User,
                as: "doctorData",
                attributes: ["firstName", "lastName"],
              },
            ],
          });
          if (!dataSchedulebooked) dataSchedulebooked = [];

          let dataSchedulefull = await db.Schedule.findAll({
            where: {
              doctorId: doctorId,
              date: date,
              currentNumber: {
                [Op.eq]: doctorInfo.count,
              },
            },
            include: [
              {
                model: db.Allcode,
                as: "timetypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.User,
                as: "doctorData",
                attributes: ["firstName", "lastName"],
              },
            ],
          });
          if (!dataSchedulefull) dataSchedulefull = [];
          resolve({
            errCode: 0,
            data: {
              nobooking: dataSchedulenobooking,
              booked: dataSchedulebooked,
              full: dataSchedulefull,
            },
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Doctor not found information",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getScheduleForWeek = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.currentDate || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: {
            doctorId: data.doctorId,
          },
        });
        let minDate = moment(data.currentDate)
          .startOf("days")
          .isoWeekday(0)
          .valueOf()
          .toString();
        let maxDate = moment(data.currentDate)
          .endOf("days")
          .isoWeekday(7)
          .valueOf()
          .toString();
        let result = await db.Schedule.findAll({
          where: {
            doctorId: data.doctorId,
            date: { [Op.lt]: maxDate, [Op.gt]: minDate },
          },
          include: [
            {
              model: db.Allcode,
              as: "timetypeData",
              attributes: [],
            },
          ],
          attributes: [
            "id",
            "currentNumber",
            "maxNumber",
            "date",
            "doctorId",
            "timetype",
            "picked_date",
            [Sequelize.literal('"timetypeData"."valueEn"'), "valueEn"],
            [Sequelize.literal('"timetypeData"."valueVi"'), "valueVi"],
          ],
          raw: true,
        });
        result.map((item) => {
          if (item.currentNumber === 0) {
            item.isBooked = false;
            item.isFullAppointment = false;
          } else {
            if (item.currentNumber < doctorInfo.count) {
              item.isBooked = true;
              item.isFullAppointment = false;
            } else {
              item.isBooked = false;
              item.isFullAppointment = true;
            }
          }
        });
        // let patientInfor=await db
        resolve({
          errCode: 0,
          errMessage: "OKK",
          data: result,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getSpecialtyScheduleByDateContainUserId = (clinicId, specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId && !specialtyId && !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let minDate = moment().valueOf().toString();
        let maxDate = moment().add(7, "days").valueOf().toString();
        console.log('minDate',minDate)
        console.log('maxDate',maxDate)

        let dataSchedule = await db.ScheduleForClinics.findAll({
          where: {
            clinicId: clinicId,
            date: { [Op.lte]: maxDate, [Op.gte]: minDate },
            specialtyId: specialtyId,
          },
          include: [
            {
              model: db.Allcode,
              as: "timetypeData",
              attributes: [],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: [],
            },
          ],
          attributes: [
            "clinicId",
            "doctorId",
            "specialtyId",
            "timetype",
            "picked_date",
            "date",
            "currentNumber",
            "maxNumber",
            [Sequelize.literal('"doctorData"."firstName"'), "firstName"],
            [Sequelize.literal('"doctorData"."lastName"'), "lastName"],
            [Sequelize.literal('"timetypeData"."valueEn"'), "valueEn"],
            [Sequelize.literal('"timetypeData"."valueVi"'), "valueVi"],
          ],
          groupBy: ["date", "timetype", "doctorId"],
          // order: [["timetype", "ASC"]],
        });
        console.log('check schedule',dataSchedule)
        if (!dataSchedule) {
          dataSchedule = [];
          resolve({
            errCode: 1,
            data: [],
          });
        } else {
          let temp = [...dataSchedule];
          temp = temp.filter((item) => item.maxNumber !== item.currentNumber);
          temp.map((item) => {
            item.dataValues.title = new Date(item.picked_date).getDay();
          });
          let specialtySchedule = temp.groupBy((item) => {
            return item.dataValues.title;
          });
          let arrSchedule = [];
          for (let i = 0; i < 7; i++) {
            if (specialtySchedule[i]) {
              let temp = specialtySchedule[i].groupBy((item) => {
                return item.timetype;
              });
              arrSchedule.push(temp);
            } else {
              let temp = {};
              arrSchedule.push(temp);
            }
          }
          resolve({
            errCode: 0,
            data: arrSchedule,
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getListPatientForDoctorWithTimeType = (doctorId, date, timeType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date || !timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataBooking = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
            timeType: timeType,
          },
        });
        console.log("data booking", dataBooking);
        resolve({
          errCode: 0,
          data: dataBooking,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailedInfor: saveDetailedInfor,
  getDetailedDoctorById: getDetailedDoctorById,
  getAllMarkdown: getAllMarkdown,
  bulkCreateSchedule: bulkCreateSchedule,
  getSelectedScheduleById: getSelectedScheduleById,
  getScheduleByDate: getScheduleByDate,
  deleteSelectedSchedule: deleteSelectedSchedule,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  postHistoryPatient: postHistoryPatient,
  getHistoryPatient: getHistoryPatient,
  getRatingDoctor: getRatingDoctor,
  getListExaminatedPatientForDoctor: getListExaminatedPatientForDoctor,
  getScheduleByDateFromDoctor: getScheduleByDateFromDoctor,
  getScheduleForWeek: getScheduleForWeek,
  getScheduleByDateContainUserId: getScheduleByDateContainUserId,
  getSpecialtyScheduleByDateContainUserId:getSpecialtyScheduleByDateContainUserId,
  getHistoryPatientByDate: getHistoryPatientByDate,
  getListPatientForDoctorWithTimeType: getListPatientForDoctorWithTimeType,
};
