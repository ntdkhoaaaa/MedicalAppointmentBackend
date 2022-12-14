import db from "../models/index";
require('dotenv').config();
import sendEmailSimple from './emailServices'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import _ from 'lodash';
const { Op } = require("sequelize");

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: false,
                nest: true
            })
            if (user) {
                user.forEach(element => {
                    if (element.image) {
                        element.image = new Buffer(element.image, 'base64').toString('binary');
                    }
                });
                // data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            resolve({
                errCode: 0,
                data: user
            })
        } catch (e) {
            reject(e);
        }
    })
}
let getAllDoctors = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (req.authRole === 'R1') {
                let doctors = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: {
                        exclude: ['password']
                    },
                })
                if (doctors) {
                    doctors.forEach(element => {
                        element.image = new Buffer(element.image, 'base64').toString('binary');
                    });
                    // data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: doctors
                })
            } else if (req.authRole === 'R2') {
                let doctors = await db.User.findOne({
                    where: { id: req.authId },
                    attributes: {
                        exclude: ['password']
                    },
                })
                if (doctors) {
                    // doctors.forEach(element => {
                    //     element.image = new Buffer(element.image, 'base64').toString('binary');
                    // });
                    doctors.image = new Buffer(doctors.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: [doctors]
                })
            } else {
                resolve({
                    errCode: 0,
                    data: {}
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}
let validateInputDataArray = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'selectedPrice',
        'selectedPayment', 'selectedProvince', 'addressClinic', 'note', 'descriptionNONHTML', 'description', 'selectedClinic', 'selectedSpecialty']
    let element = '';
    let isValid = true;
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}
let saveDetailedInfor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('check input', inputData)
            let validateInput = validateInputDataArray(inputData);
            if (validateInput.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter ${validateInput.element}!`
                })
            } else {
                console.log('check input', inputData)
                let isExist = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId }
                })
                if (!isExist) {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        descriptionNONHTML: inputData.descriptionNONHTML,
                        doctorId: inputData.doctorId,
                    })
                }
                else {
                    isExist.contentHTML = inputData.contentHTML;
                    isExist.contentMarkdown = inputData.contentMarkdown;
                    isExist.description = inputData.description;
                    isExist.descriptionNONHTML = inputData.descriptionNONHTML;
                    isExist.updateAt = new Date();
                    await isExist.save();
                }
                console.log('Markdown saved Successfully', isExist)
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (doctorInfor) {
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.nameSpecialty = inputData.nameSpecialty
                    doctorInfor.clinicId = inputData.selectedClinic;
                    doctorInfor.specialtyId = inputData.selectedSpecialty;
                    doctorInfor.note = inputData.note;
                    doctorInfor.count = inputData.count;
                    doctorInfor.updateAt = new Date();
                    await doctorInfor.save();
                    resolve({
                        errCode: 2,
                        errMessage: 'update a doctor infor for doctor successfully'
                    })
                }
                else {
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
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'create a doctor infor for doctor successfully'
                    })
                }
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
let getDetailedDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown', 'descriptionNONHTML']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            ]
                            // attributes: ['description', 'contentHTML', 'contentMarkdown']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                else data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getAllMarkdown = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Markdown.findAll()
            resolve({
                errCode: 0,
                data: data
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let doctorInfo = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: data.doctorId
                    }
                })
                await db.Schedule.destroy({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        maxNumber: {
                            [Op.eq]: doctorInfo.count
                        }
                    }
                })
                let schedule = data.arrSchedule;
                schedule = schedule.map(item => {
                    item.maxNumber = doctorInfo.count ? doctorInfo.count : MAX_NUMBER_SCHEDULE;
                    return item;
                })
                // && c.doctorId === c.doctorId
                await db.Schedule.bulkCreate(schedule)
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
let getSelectedScheduleById = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!doctorId && !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    }
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        maxNumber: {
                            [Op.gt]: 0
                        }
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timetypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName']
                        }
                    ],
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
let deleteSelectedSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        let schedule = await db.Schedule.findOne({
            where: { id: data }
        })
        console.log('logdataa', data)
        if (!schedule) {
            resolve({
                errCode: 2,
                errMessage: "This user is not exist"
            })
        }
        await schedule.destroy({
            where: { id: data }
        });
        resolve({
            errCode: 0,
            message: "Completed"
        })
    })
}
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('getExtraInforDoctorById')
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Specialty, as: 'specialtyData', attributes: ['name', 'nameEn'] },
                        { model: db.Clinics, as: 'clinicData', attributes: ['name', 'nameEn', 'address', 'addressEn'] }

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data) {
                    if (data.image) {
                        data.image = new Buffer(data.image, 'base64').toString('binary');
                    }
                }
                else data = {}
                // if (data && data.image) {
                //     data.image = new Buffer(data.image, 'base64').toString('binary');
                // }
                // if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let dataBooking = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    }
                })

                resolve({
                    errCode: 0,
                    data: dataBooking
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getListExaminatedPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let dataBooking = await db.Booking.findAll({
                    where: {
                        statusId: 'S3',
                        doctorId: doctorId,
                        date: date
                    }
                })

                resolve({
                    errCode: 0,
                    data: dataBooking
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let postHistoryPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.bookingId || !data.medicalRecords) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                    data: data
                })
            }
            else {
                let bookinginfo = await db.Booking.findOne({
                    where: {
                        id: data.bookingId
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email']
                        },
                        {
                            model: db.User,
                            as: 'doctorInfoData',
                            attributes: ['email', 'lastName', 'firstName']
                        }
                    ]
                })
                if (bookinginfo) {
                    await db.History.create({
                        bookingId: data.bookingId,
                        medicalRecords: data.medicalRecords,
                        medicineRange: data.medicineRange,
                    }).then(async function (x) {
                        let dataReceipt = data.receipts.map(item => {
                            item.historyId = x.id;
                            return item;
                        })
                        await db.Receipt.bulkCreate(dataReceipt)
                        resolve({
                            errCode: 0,
                            errMessage: 'create history success',
                            bookinginfo
                        })
                    })
                    await db.Booking.update({
                        statusId: 'S3'
                    }, {
                        where: {
                            id: data.bookingId
                        }
                    })

                    await sendEmailSimple.sendEmailHistoryToPatient({
                        receiverMail: bookinginfo.patientData.email,
                        patientName: bookinginfo.forWho,
                        time: bookinginfo.bookingDate,
                        doctorName: `${bookinginfo.doctorInfoData.lastName} ${bookinginfo.doctorInfoData.firstName}`,
                        receipts: data.receipts,
                        medicalRecords: data.medicalRecords,
                        medicineRange: data.medicineRange,
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        errMessage: 'booking notfound',
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getHistoryPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                })
            }
            else {
                // let bookinginfo = await db.Booking.findOne({
                //     where: {
                //         id: data
                //     },
                //     include: [
                //         {
                //             model: db.History,
                //             include: [{
                //                 model: db.Receipt,
                //                 as: 'receiptData',
                //             }]
                //         },
                //         {
                //             model: db.User,
                //             as: 'doctorInfoData',
                //             attributes: ['email', 'firstName', 'lastName', 'image'],
                //             include: [{
                //                 model: db.Doctor_Infor,
                //                 attributes: {
                //                     exclude: ['id', 'doctorId']
                //                 },
                //             }]
                //         }
                //     ]
                // })
                // if (bookinginfo) {
                //     resolve({
                //         errCode: 0,
                //         historyInfo: bookinginfo

                //     })
                // }
                // else {
                //     resolve({
                //         errCode: 1,
                //         errMessage: 'booking notfound',

                //     })
                // }
                let historyInfo = await db.History.findOne({
                    where: {
                        bookingId: data
                    },
                    include: [
                        {
                            model: db.Receipt,
                            as: 'receiptData',
                            attributes: {
                                exclude: ['id', 'historyId']
                            },
                        },
                        {
                            model: db.Booking,
                            attributes: ['doctorId'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'doctorInfoData',
                                    attributes: ['email', 'firstName', 'lastName', 'image', 'id'],
                                    include: [{
                                        model: db.Doctor_Infor,
                                        attributes: {
                                            exclude: ['id', 'doctorId']
                                        },
                                    }]
                                }
                            ]
                        },
                    ]
                })
                if (historyInfo) {
                    resolve({
                        errCode: 0,
                        historyInfo: historyInfo
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        errMessage: 'booking notfound',

                    })
                }

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getRatingDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                })
            }
            else {
                let ratingInfo = await db.Rating.findAll({
                    where: {
                        doctorId: data
                    },
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.Booking,
                            attributes: ['patientId'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'patientData',
                                    attributes: ['email', 'firstName', 'lastName', 'image', 'id', 'gender'],
                                }
                            ]
                        }
                    ]
                })
                console.log('check image', ratingInfo[0].Booking.patientData.image)
                if (ratingInfo) {
                    ratingInfo.forEach(element => {
                        if (element.Booking.patientData.image) {
                            element.Booking.patientData.image = new Buffer(element.Booking.patientData.image, 'base64').toString('binary');

                        }
                    })
                    // ratingInfo.Booking.patientData.image = new Buffer(users.image, 'base64').toString('binary');
                }
                if (ratingInfo) {
                    var result = await ratingInfo.map(function (el) {
                        var o = Object.assign({}, el);
                        let firstDate = new Date(el.updatedAt),
                            secondDate = new Date(),
                            timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
                        let differentDays = Math.floor(timeDifference / (1000 * 3600 * 24));
                        let sothang = parseInt(differentDays / 30);
                        let songay = differentDays;
                        o.songay = songay;
                        o.sothang = sothang;
                        return o;
                    })
                    resolve({
                        errCode: 0,
                        ratingInfo: result
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        ratingInfo: ratingInfo,

                    })
                }

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDateFromDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let doctorInfo = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    }
                })
                if (doctorInfo) {
                    let dataSchedulenobooking = await db.Schedule.findAll({
                        where: {
                            doctorId: doctorId,
                            date: date,
                            maxNumber: {
                                [Op.eq]: doctorInfo.count
                            }
                        },
                        include: [
                            {
                                model: db.Allcode,
                                as: 'timetypeData',
                                attributes: ['valueEn', 'valueVi']
                            },
                            {
                                model: db.User,
                                as: 'doctorData',
                                attributes: ['firstName', 'lastName']
                            }
                        ],
                    })
                    if (!dataSchedulenobooking) dataSchedulenobooking = [];

                    let dataSchedulebooked = await db.Schedule.findAll({
                        where: {
                            doctorId: doctorId,
                            date: date,
                            maxNumber: {
                                [Op.and]: {
                                    [Op.lt]: doctorInfo.count,
                                    [Op.gt]: 0
                                }
                            }
                        },
                        include: [
                            {
                                model: db.Allcode,
                                as: 'timetypeData',
                                attributes: ['valueEn', 'valueVi']
                            },
                            {
                                model: db.User,
                                as: 'doctorData',
                                attributes: ['firstName', 'lastName']
                            }
                        ],
                    })
                    if (!dataSchedulebooked) dataSchedulebooked = [];

                    let dataSchedulefull = await db.Schedule.findAll({
                        where: {
                            doctorId: doctorId,
                            date: date,
                            maxNumber: {
                                [Op.lte]: 0
                            }
                        },
                        include: [
                            {
                                model: db.Allcode,
                                as: 'timetypeData',
                                attributes: ['valueEn', 'valueVi']
                            },
                            {
                                model: db.User,
                                as: 'doctorData',
                                attributes: ['firstName', 'lastName']
                            }
                        ],
                    })
                    if (!dataSchedulefull) dataSchedulefull = [];
                    resolve({
                        errCode: 0,
                        data: {
                            nobooking: dataSchedulenobooking,
                            booked: dataSchedulebooked,
                            full: dataSchedulefull
                        }
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Doctor not found information'
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
    getScheduleByDateFromDoctor: getScheduleByDateFromDoctor
}