import db from "../models/index";
import moment from "moment";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

require("dotenv").config();
const Sequelize = require("sequelize");
let bulkCreateSchedulesForDoctors = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let schedule = data.arrSchedule;
        schedule.map((item) => {
          if (item.timetype === "TM") {
            let o1 = { ...item };
            o1.timetype = "T1";
            let o2 = { ...item };
            o2.timetype = "T2";
            let o3 = { ...item };
            o3.timetype = "T3";
            let o4 = { ...item };
            o4.timetype = "T4";
            schedule.push(o1);
            schedule.push(o2);
            schedule.push(o3);
            schedule.push(o4);
            schedule = schedule.filter((element) => element !== item);
          }
          if (item.timetype === "TA") {
            let o1 = { ...item };
            o1.timetype = "T5";
            let o2 = { ...item };
            o2.timetype = "T6";
            let o3 = { ...item };
            o3.timetype = "T7";
            let o4 = { ...item };
            o4.timetype = "T8";
            schedule.push(o1);
            schedule.push(o2);
            schedule.push(o3);
            schedule.push(o4);
            schedule = schedule.filter((element) => element !== item);
          }
        });
        await db.ScheduleForClinics.bulkCreate(schedule);

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
let getClinicWeekSchedules = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.clinicId || !data.timetype) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let minDate = moment(new Date())
          .isoWeekday(7)
          .startOf("days")
          .valueOf()
          .toString();
        let maxDate = moment(new Date())
          .isoWeekday(14)
          .endOf("days")
          .valueOf()
          .toString();
        console.log("minDate: " + minDate + " maxDate: " + maxDate);

        if (data.timetype === "TM") data.timetype = "T1";
        else data.timetype = "T5";
        let result = await db.ScheduleForClinics.findAll({
          where: {
            clinicId: data.clinicId,
            date: { [Op.lt]: maxDate, [Op.gt]: minDate },
            timetype: data.timetype,
          },
          include: [{ model: db.User, attributes: [], as: "doctorData" }],
          attributes: [
            "picked_date",
            "clinicId",
            "specialtyId",
            "date",
            "timetype",
            [Sequelize.literal('"doctorData"."email"'), "UserEmail"],
            [Sequelize.literal('"doctorData"."firstName"'), "firstName"],
            [Sequelize.literal('"doctorData"."lastName"'), "lastName"],
            [Sequelize.literal('"doctorData"."address"'), "address"],
            [Sequelize.literal('"doctorData"."phoneNumber"'), "phoneNumber"],
            [Sequelize.literal('"doctorData"."image"'), "image"],
            [Sequelize.literal('"doctorData"."positionId"'), "positionId"],
          ],
          exclude: [{ model: db.User }],
          raw: true,
        });
        console.log('checker',result)
        if (result && result.length > 0) {
          result.map((element) => {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          });
        }
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
let createNewDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used.Try another one",
        });
      } else {
        let nameSpecialty = await db.ClinicSpecialty.findOne({
          where: {
            id: data.specialtyId,
          },
          attributes: ["name", "nameEn"],
        });
        let hashPasswordfrromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordfrromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: "R5",
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
        await db.Doctor_Clinic_Specialty.create({
          doctorId: userId.id,
          specialtyId: data.specialtyId,
          clinicId: data.clinicId,
          count: data.count,
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
let getAllDoctorOfHospital = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId && !specialtyCode && !positionCode) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Doctor_Clinic_Specialty.findAll({
          where: {
            clinicId: clinicId,
          },
          include: [
            { model: db.User, attributes: [] },
            {
              model: db.ClinicSpecialty,
              attributes: [],
              as: "specialtyData",
            },
          ],
          attributes: [
            [Sequelize.literal('"User"."id"'), "id"],
            [Sequelize.literal('"User"."email"'), "UserEmail"],
            [Sequelize.literal('"User"."firstName"'), "firstName"],
            [Sequelize.literal('"User"."lastName"'), "lastName"],
            [Sequelize.literal('"User"."address"'), "address"],
            [Sequelize.literal('"User"."phoneNumber"'), "phoneNumber"],
            [Sequelize.literal('"User"."image"'), "image"],
            [Sequelize.literal('"User"."gender"'), "gender"],
            [Sequelize.literal('"User"."positionId"'), "positionId"],
            [Sequelize.literal('"specialtyData"."name"'), "nameSpecialty"],
            [Sequelize.literal('"specialtyData"."nameEn"'), "nameSpecialtyEn"],
            "clinicId",
            "specialtyId",
            "count",
            "doctorId",
          ],
          raw: true,
        });

        // if (specialtyCode !== "All") {
        //   if (data && data.length > 0) {
        //     data = data.filter((element) => {
        //       return element.specialtyId === specialtyCode;
        //     });
        //   }
        // }
        // if (positionCode !== "All") {
        //   if (data && data.length > 0) {
        //     data = data.filter((element) => {
        //       return element.positionId.toString() === positionCode;
        //     });
        //   }
        // }

        if (data && data.length > 0) {
          data.map((element) => {
            if (element.image) {
              element.image = new Buffer(element.image, "base64").toString(
                "binary"
              );
            }
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

let editDoctorInfor = (data) => {
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
      let doctorInfor = await db.Doctor_Clinic_Specialty.findOne({
        where: {
          doctorId: data.id,
        },
      });
      if (doctorInfor) {
        doctorInfor.specialtyId = data.specialtyId;
        doctorInfor.count = data.count;
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
let deleteDoctor = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    let doctorInfor = await db.Doctor_Clinic_Specialty.findOne({
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
let getSpecialtyDoctorWeeklySchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.currentDate || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let doctorInfo = await db.Doctor_Clinic_Specialty.findOne({
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
        let result = await db.ScheduleForClinics.findAll({
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
            [Sequelize.literal("timetypeData.valueEn"), "valueEn"],
            [Sequelize.literal("timetypeData.valueVi"), "valueVi"],
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
let getBookingScheduleByDateFromHospital = (hospitalId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!hospitalId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let bookingByDateFromHospital = await db.Booking.findAll({
          where: {
            clinicId: hospitalId,
            date: date,
            statusId: "S2",
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["*"],
            },
          ],
        });
        resolve({
          errCode: 0,
          errMessage: "OKK",
          data: bookingByDateFromHospital,
        });
      }
    } catch (e) {
      resolve({
        errCode: 1,
        errMessage: "Error from server" + e,
      });
    }
  });
};
module.exports = {
  bulkCreateSchedulesForDoctors: bulkCreateSchedulesForDoctors,
  getClinicWeekSchedules: getClinicWeekSchedules,
  createNewDoctor: createNewDoctor,
  getAllDoctorOfHospital: getAllDoctorOfHospital,
  editDoctorInfor: editDoctorInfor,
  deleteDoctor: deleteDoctor,
  getSpecialtyDoctorWeeklySchedule: getSpecialtyDoctorWeeklySchedule,
  getBookingScheduleByDateFromHospital: getBookingScheduleByDateFromHospital,
};
