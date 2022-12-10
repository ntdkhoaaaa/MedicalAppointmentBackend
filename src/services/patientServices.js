import db from "../models/index";
require('dotenv').config();
import sendEmailSimple from './emailServices'
import { v4 as uuidv4 } from 'uuid';
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timetype || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let token = uuidv4();
                await sendEmailSimple.sendEmailSimple({
                    receiverMail: data.email,
                    patientName: data.language === 'vi' ? `${data.lastName} ${data.firstName}` : `${data.firstName} ${data.lastName}`,
                    time: data.pickDate,
                    language: data.language,
                    doctorName: data.doctorName,
                    confirmlink: buildUrlEmail(data.doctorId, token)
                })
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                    },
                });
                console.log(data)

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timetype,
                        },
                        defaults: {
                            statusId: 'S1',
                            prognostic: data.reason,
                            forWho: data.firstName + ' ' + data.lastName + '(' + data.forwho + ')',
                            bookingDate: data.pickDate,
                            patientAge: data.patientAge,
                            gender: data.genderIdentity,
                            token: token,
                            phoneNumber: data.phoneNumber,
                            address: data.address,
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save patient booking success',
                    // data: data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
let postVerifyBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Save patient booking success',
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "The appointment doesn't exist or it has already confirmed"
                    })
                }
            }
        }
        catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBooking: postVerifyBooking
}