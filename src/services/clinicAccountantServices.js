import db from "../models/index";
import moment from "moment";
import { Op } from "sequelize";
import bcrypt from "bcryptjs"
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
        currentDate.setHours(10)
        currentDate.setMinutes(0)
        currentDate.setMilliseconds(0)
        let minDate= (new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay())
        ).getTime()/1000).toString();
        // currentDate.setHours(12)
        // currentDate.setMinutes(60)
        // currentDate.setMilliseconds(60)
        let maxDate= (new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)
        ).getTime()/1000).toString()
        let result=await db.ScheduleForClinics.findAll({
            where: {
                clinicId:data.clinicId,
                date:{[Op.lte]:maxDate,[Op.gte]:minDate},
            },
            include: [{ model: db.User, attributes: [],as :"doctorData" }],
            attributes: [
              "picked_date","clinicId","specialtyId","date",
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
          data:result
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
                  errMessage: 'Your email is already in used.Try another one'
              })
          }
          else {
              let hashPasswordfrromBcrypt = await hashUserPassword(data.password);
              await db.User.create({
                  email: data.email,
                  password: hashPasswordfrromBcrypt,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  address: data.address,
                  phoneNumber: data.phoneNumber,
                  gender: data.gender,
                  roleId: 'R2',
                  positionId: data.positionId,
                  image: data.avatar,
                  // statusId: data.statusId,
                  clinicId: data.clinicId
              })
              let userId=await db.User.findOne({
                where:{
                  email: data.email,
                },
                attributes:['id']
              })
              await db.Doctor_Clinic_Specialty.create({
                doctorId:userId.id,
                specialtyId:data.specialtyId,
                clinicId: data.clinicId
              })
              console.log(userId)
              resolve({
                  errCode: 0,
                  errMessage: 'Ok'
              });
          }
      } catch (e) {
          reject(e)
      }
  })
}
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
      try {
          let user = await db.User.findOne({
              where: { email: userEmail }
          })
          if (user) {
              resolve(true)
          }
          else { resolve(false) }
      } catch (e) {
          reject(e)
      }
  })
}
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
      try {
          let hashPassword = await bcrypt.hashSync(password, salt);
          resolve(hashPassword)
      } catch (e) {
          reject(e);
      }
  })
}
module.exports = {
  bulkCreateSchedulesForDoctors: bulkCreateSchedulesForDoctors,
  getClinicWeekSchedules: getClinicWeekSchedules,
  createNewDoctor:createNewDoctor
};
