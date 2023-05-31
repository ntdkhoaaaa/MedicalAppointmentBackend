import clinicAccountantServices from "../services/clinicAccountantServices"
let bulkCreateSchedulesForDoctors = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.bulkCreateSchedulesForDoctors(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let getClinicWeekSchedules = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.getClinicWeekSchedules(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let createNewDoctor = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.createNewDoctor(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let editDoctorInfor = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.editDoctorInfor(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let getAllDoctorOfHospital = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.getAllDoctorOfHospital(req.body.clinicId,req.body.specialtyCode,req.body.positionCode);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter!"
        })
    }
    let message = await clinicAccountantServices.deleteDoctor(req.body.userId)
    return res.status(200).json(message);
}
let getSpecialtyDoctorWeeklySchedule = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.getSpecialtyDoctorWeeklySchedule(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let getBookingScheduleByDateFromHospital = async (req, res) => {
    try {
        let infor = await clinicAccountantServices.getBookingScheduleByDateFromHospital(req.body.hospitalId,req.body.date);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
module.exports ={
    bulkCreateSchedulesForDoctors:bulkCreateSchedulesForDoctors,
    getClinicWeekSchedules:getClinicWeekSchedules,
    createNewDoctor:createNewDoctor,
    getAllDoctorOfHospital:getAllDoctorOfHospital,
    editDoctorInfor:editDoctorInfor,
    handleDeleteUser:handleDeleteUser,
    getSpecialtyDoctorWeeklySchedule:getSpecialtyDoctorWeeklySchedule,
    getBookingScheduleByDateFromHospital:getBookingScheduleByDateFromHospital
}