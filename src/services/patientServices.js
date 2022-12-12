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

                let user = await db.User.findOne({
                    where: {
                        email: data.email
                    }
                });
                if (user) {
                    await db.Booking.create({
                        patientId: user.id,
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timetype,
                        statusId: 'S1',
                        prognostic: data.reason,
                        forWho: data.firstName + ' ' + data.lastName + '(' + data.forwho + ')',
                        bookingDate: data.pickDate,
                        patientAge: data.patientAge,
                        gender: data.genderIdentity,
                        token: token,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                    })
                    await sendEmailSimple.sendEmailSimple({
                        receiverMail: data.email,
                        patientName: data.language === 'vi' ? `${data.lastName} ${data.firstName}` : `${data.firstName} ${data.lastName}`,
                        time: data.pickDate,
                        language: data.language,
                        doctorName: data.doctorName,
                        confirmlink: buildUrlEmail(data.doctorId, token)
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Save patient booking success',
                        // data: data
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'User not found u must to login again',
                        // data: data
                    })
                }

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
let getBookingInfoByProfile = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parametter ...'
                })
            }
            else {
                let dataBooking = await db.Booking.findAll({
                    where: {
                        patientId: userId
                    },
                    attributes: ['bookingDate', 'prognostic', 'id', 'patientAge', 'gender', 'address', 'phoneNumber', 'doctorId'],
                    include: [
                        {
                            model: db.User, as: 'doctorInfoData',
                            attributes: ['firstName', 'lastName', 'id'],
                            include: [
                                {
                                    model: db.Doctor_Infor,
                                    attributes: ['addressClinic', 'nameClinic', 'nameSpecialty'],

                                }
                            ],
                            plain: true,
                            raw: false,
                            nest: true,
                        },
                    ],
                    raw: false,
                    nest: true,

                })
                resolve(dataBooking)

            }
        } catch (e) {
            console.log(e)
            reject(e)

        }
    })
}
let cancelBookingformPatient = (bookingId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parametter ...'
                })
            }
            else {
                let dataBooking = await db.Booking.findOne({
                    where: {
                        id: bookingId
                    },
                    include:
                        [
                            {
                                model: db.User,
                                as: 'patientData',
                                attributes: ['email']
                            },
                            {
                                model: db.User,
                                as: 'doctorInfoData',
                                attributes: ['lastName', 'firstName']
                            }
                        ]
                })
                if (dataBooking) {
                    let difference = dataBooking.date - new Date().getTime();
                    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

                    if (daysDifference >= 1) {
                        await db.Booking.update({
                            statusId: 'S4'
                        }, {
                            where: {
                                id: bookingId
                            }
                        })
                        await sendEmailSimple.sendEmailCancelSchedule({
                            receiverMail: dataBooking.patientData.email,
                            patientName: dataBooking.forWho,
                            time: dataBooking.bookingDate,
                            doctorName: `${dataBooking?.doctorInfoData?.lastName} ${dataBooking?.doctorInfoData?.firstName}`,
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'delete success',
                            dataBooking
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'schedule not cancel, plz check again',
                            dataBooking
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'schedule not found, plz check again',
                    })
                }

            }
        } catch (e) {
            console.log(e)
            reject(e)

        }
    })
}
let postRatingPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.patientId || !data.doctorId || !data.bookingId || !data.rate) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parametter ...'
                })
            }
            else {
                let dataBooking = await db.Booking.findOne({
                    where: {
                        id: data.bookingId
                    }
                })
                if (dataBooking) {
                    await db.Rating.create({
                        patientId: data.patientId,
                        doctorId: data.doctorId,
                        rate: data.rate,
                        comment: data.comment
                    })
                    await db.Booking.update({
                        statusId: 'S5'
                    }, {
                        where: {
                            id: data.bookingId
                        }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: ' create rating success',
                    })

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'booking not found, plz check again',
                    })
                }

            }
        } catch (e) {
            console.log(e)
            reject(e)

        }
    })
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBooking: postVerifyBooking,
    getBookingInfoByProfile: getBookingInfoByProfile,
    cancelBookingformPatient: cancelBookingformPatient,
    postRatingPatient: postRatingPatient
}