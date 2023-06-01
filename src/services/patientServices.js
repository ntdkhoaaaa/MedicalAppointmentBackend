import db from "../models/index";
require("dotenv").config();
import sendEmailSimple from "./emailServices";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";


let buildUrlEmail = (doctorId, token, fromSpecialtyHospital) => {
  if (!fromSpecialtyHospital) {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
  } else {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}&fromSpecialtyHospital=${fromSpecialtyHospital}`;
    return result;
  }
};
let postBookingAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email
         || !data.doctorId 
         || !data.timetype
          || !data.date
          || !data.reason

          ) {
          
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let token = uuidv4();
        let user = await db.User.findOne({
          where: {
            email: data.email,
          },
        });
        if (!data.fromSpecialtyHospital) {
          if (user) {
            await db.Booking.create({
              patientId: user.id,
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timetype,
              statusId: "S1",
              prognostic: data.reason,
              forWho:
                data.firstName + " " + data.lastName + "(" + data.forwho + ")",
              bookingDate: data.pickDate,
              patientAge: data.patientAge,
              gender: data.genderIdentity,
              token: token,
              phoneNumber: data.phoneNumber,
              address: data.address,
              pathology: data.pathology,
              bloodType: data.bloodType,
              weight: data.weight,
              height: data.height,
              clinicId:null
            });
            console.log('check send mail 62')
            await sendEmailSimple.sendEmailSimple({
              receiverMail: data.email,
              patientName:
                data.language === "vi"
                  ? `${data.lastName} ${data.firstName}`
                  : `${data.firstName} ${data.lastName}`,
              time: data.pickDate,
              language: data.language,
              doctorName: data.doctorName,
              confirmlink: buildUrlEmail(
                data.doctorId,
                token,
                data.fromSpecialtyHospital
              ),
            });
            console.log('check send mail 78')

            resolve({
              errCode: 0,
              errMessage: "Save patient booking success",
              // data: data
            });
          } else {
            resolve({
              errCode: 3,
              errMessage: "User not found u must to login again",
              // data: data
            });
          }
        } else {
          if (user) {
            await db.Booking.create({
              patientId: user.id,
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timetype,
              statusId: "S1",
              prognostic: data.reason,
              forWho:
                data.firstName + " " + data.lastName + "(" + data.forwho + ")",
              bookingDate: data.pickDate,
              patientAge: data.patientAge,
              gender: data.genderIdentity,
              token: token,
              phoneNumber: data.phoneNumber,
              address: data.address,
              clinicId: data.clinicId,
              specialtyId: data.specialtyId,
              pathology: data.pathology,
              bloodType: data.bloodType,
              weight: data.weight,
              height: data.height,
            });
            await sendEmailSimple.sendEmailSimple({
              receiverMail: data.email,
              patientName:
                data.language === "vi"
                  ? `${data.lastName} ${data.firstName}`
                  : `${data.firstName} ${data.lastName}`,
              time: data.pickDate,
              language: data.language,
              doctorName: data.doctorName,
              confirmlink: buildUrlEmail(
                data.doctorId,
                token,
                data.fromSpecialtyHospital
              ),
            });
            resolve({
              errCode: 0,
              errMessage: "Save patient booking success",
            });
          } else {
            resolve({
              errCode: 3,
              errMessage: "User not found u must to login again",
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let postVerifyBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.token) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        console.log('check verify appointment 166', appointment);
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          if (!data.fromSpecialtyHospital) {
            let scheduleInfo = await db.Schedule.findOne({
              where: {
                doctorId: data.doctorId,
                date: appointment.dataValues.date,
                timetype: appointment.dataValues.timeType,
              },
              raw: false,
            });
            if (scheduleInfo) {
              scheduleInfo.currentNumber = scheduleInfo.currentNumber + 1;
              await scheduleInfo.save();
            }
            resolve({
              errCode: 0,
              errMessage: "Save patient booking success",
            });
          } else {
            let scheduleInfo = await db.ScheduleForClinics.findOne({
              where: {
                doctorId: data.doctorId,
                date: appointment.dataValues.date,
                timetype: appointment.dataValues.timeType,
              },
              raw: false,
            });
            if (scheduleInfo) {
              scheduleInfo.currentNumber = scheduleInfo.currentNumber + 1;
              await scheduleInfo.save();
            }
            resolve({
              errCode: 0,
              errMessage: "Save patient booking success",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage:
              "The appointment doesn't exist or it has already confirmed",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getBookingInfoByProfile = (userId,date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: -1,
          errMessage: "Missing parametter ...",
        });
      } else {
        let dataBooking = await db.Booking.findAll({
          where: {
            patientId: userId,
            
          },
          attributes: [
            "statusId",
            "forWho",
            "bookingDate",
            "prognostic",
            "id",
            "patientAge",
            "gender",
            "address",
            "phoneNumber",
            "doctorId",
            "date",
          ],
          include: [
            {
              model: db.User,
              as: "doctorInfoData",
              attributes: ["firstName", "lastName", "id"],
              include: [
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
              plain: true,
              raw: false,
              nest: true,
            },
          ],
          raw: false,
          nest: true,
        });
        resolve(dataBooking);
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let cancelBookingformPatient = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        resolve({
          errCode: -1,
          errMessage: "Missing parametter ...",
        });
      } else {
        let dataBooking = await db.Booking.findOne({
          where: {
            id: bookingId,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attribute: ["email"],
            },
            {
              model: db.User,
              as: "doctorInfoData",
              attributes: ["lastName", "firstName"],
            },
          ],
        });
        console.log('check console log 310', dataBooking.email)
        if (dataBooking) {
          let difference = dataBooking.date - new Date().getTime();
          let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
          console.log('check console log 314', dataBooking)

          if (daysDifference >= 1) {
            await db.Booking.update(
              {
                statusId: "S4",
              },
              {
                where: {
                  id: bookingId,
                },
              }
            );
        console.log('check console log 327', dataBooking)

            await sendEmailSimple.sendEmailCancelSchedule({
              receiverMail: dataBooking.patientData.email,
              patientName: dataBooking.forWho,
              time: dataBooking.bookingDate,
              doctorName: `${dataBooking?.doctorInfoData?.lastName} ${dataBooking?.doctorInfoData?.firstName}`,
            });
        console.log('check console log 335', dataBooking)

            resolve({
              errCode: 0,
              errMessage: "delete success",
              dataBooking,
            });
          } else {
            resolve({
              errCode: 1,
              errMessage:
                "This schedule is uncancelable because the appointment is coming in 24 hours",
              dataBooking,
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: "schedule not found, plz check again",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let postRatingPatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.patientId || !data.doctorId || !data.bookingId || !data.rate) {
        resolve({
          errCode: -1,
          errMessage: "Missing parametter ...",
        });
      } else {
        let dataBooking = await db.Booking.findOne({
          where: {
            id: data.bookingId,
          },
        });
        if (dataBooking) {
          await db.Rating.create({
            patientId: data.patientId,
            doctorId: data.doctorId,
            rate: data.rate,
            comment: data.comment,
            bookingId: data.bookingId,
          });
          await db.Booking.update(
            {
              statusId: "S5",
            },
            {
              where: {
                id: data.bookingId,
              },
            }
          );
          resolve({
            errCode: 0,
            errMessage: " create rating success",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "booking not found, plz check again",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getDataSearch = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataDoctor = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
      });
      if (dataDoctor) {
        dataDoctor.forEach((element) => {
          if (element.image) {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          }
        });
      }
      let dataSpecialty = await db.Specialty.findAll({});
      if (dataSpecialty) {
        dataSpecialty.forEach((element) => {
          if (element.image) {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          }
        });
      }
      let dataClinic = await db.Clinics.findAll({});
      if (dataClinic) {
        dataClinic.forEach((element) => {
          if (element.image) {
            element.image = new Buffer(element.image, "base64").toString(
              "binary"
            );
          }
        });
      }
      resolve({
        errCode: 0,
        dataDoctor,
        dataClinic,
        dataSpecialty,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
module.exports = {
  postBookingAppointment: postBookingAppointment,
  postVerifyBooking: postVerifyBooking,
  getBookingInfoByProfile: getBookingInfoByProfile,
  cancelBookingformPatient: cancelBookingformPatient,
  postRatingPatient: postRatingPatient,
  getDataSearch: getDataSearch,
};
