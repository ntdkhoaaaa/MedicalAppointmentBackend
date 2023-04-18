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
      if (!data.currentDate || !data.clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let temp = Date.now(data.currentDate);
        let currentDate = new Date(temp);
        currentDate.setHours(10);
        currentDate.setMinutes(0);
        currentDate.setMilliseconds(0);
        let minDate = (
          new Date(
            currentDate.setDate(currentDate.getDate() - currentDate.getDay())
          ).getTime() / 1000
        ).toString();
        let maxDate = (
          new Date(
            currentDate.setDate(
              currentDate.getDate() - currentDate.getDay() + 7
            )
          ).getTime() / 1000
        ).toString();
        let result = await db.ScheduleForClinics.findAll({
          where: {
            clinicId: data.clinicId,
            date: { [Op.lte]: maxDate, [Op.gte]: minDate },
          },
          include: [{ model: db.User, attributes: [], as: "doctorData" }],
          attributes: [
            "picked_date",
            "clinicId",
            "specialtyId",
            "date",
            [Sequelize.literal("`doctorData`.`email`"), "UserEmail"],
            [Sequelize.literal("`doctorData`.`firstName`"), "firstName"],
            [Sequelize.literal("`doctorData`.`lastName`"), "lastName"],
            [Sequelize.literal("`doctorData`.`address`"), "address"],
            [Sequelize.literal("`doctorData`.`phoneNumber`"), "phoneNumber"],
            [Sequelize.literal("`doctorData`.`image`"), "image"],
            [Sequelize.literal("`doctorData`.`positionId`"), "positionId"],
          ],
          exclude: [{ model: db.User }],
          raw: true,
        });
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
          // statusId: data.statusId,
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
let getAllDoctorOfHospital = (clinicId, specialtyCode, positionCode) => {
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
            [Sequelize.literal("`User`.`id`"), "id"],
            [Sequelize.literal("`User`.`email`"), "UserEmail"],
            [Sequelize.literal("`User`.`firstName`"), "firstName"],
            [Sequelize.literal("`User`.`lastName`"), "lastName"],
            [Sequelize.literal("`User`.`address`"), "address"],
            [Sequelize.literal("`User`.`phoneNumber`"), "phoneNumber"],
            // [Sequelize.literal("`User`.`lastName`"+"`User`.`firstName`"), "fullName"],
            [Sequelize.literal("`User`.`image`"), "image"],
            [Sequelize.literal("`User`.`gender`"), "gender"],
            [Sequelize.literal("`User`.`positionId`"), "positionId"],
            [Sequelize.literal("`specialtyData`.`name`"), "nameSpecialty"],
            [Sequelize.literal("`specialtyData`.`nameEn`"), "nameSpecialtyEn"],
            "clinicId",
            "specialtyId",
            "count",
            "doctorId",
          ],
          exclude: [
            { model: db.User },
            // {model:db.ClinicSpecialty}
          ],
          raw: true,
        });
        if (specialtyCode !== "All") {
          if (data && data.length > 0) {
            data = data.filter((element) => {
              return element.specialtyId === specialtyCode;
            });
          }
        }
        if (positionCode !== "All") {
          if (data && data.length > 0) {
            data = data.filter((element) => {
              return element.positionId.toString() === positionCode;
            });
          }
        }
        if (data && data.length > 0) {
          data.map((element) => {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
            element.fullName=element.lastName +" "+element.firstName
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
module.exports = {
  bulkCreateSchedulesForDoctors: bulkCreateSchedulesForDoctors,
  getClinicWeekSchedules: getClinicWeekSchedules,
  createNewDoctor: createNewDoctor,
  getAllDoctorOfHospital: getAllDoctorOfHospital,
  editDoctorInfor: editDoctorInfor,
  deleteDoctor: deleteDoctor,
};
