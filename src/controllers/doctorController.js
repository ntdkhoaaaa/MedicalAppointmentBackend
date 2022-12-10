import doctorServices from "../services/doctorServices"
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorServices.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorServices.getAllDoctors(req.body);
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })

    }
}
let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorServices.saveDetailedInfor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server heree'
        })
    }
}
let getDetailedDoctorById = async (req, res) => {
    try {
        let infor = await doctorServices.getDetailedDoctorById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllMarkdown = async (req, res) => {
    try {
        let markdowns = await doctorServices.getAllMarkdown();
        return res.status(200).json(markdowns)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server', e
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorServices.bulkCreateSchedule(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getSelectedScheduleById = async (req, res) => {
    try {
        let selectedSchedule = await doctorServices.getSelectedScheduleById(req.query.doctorId, req.query.date)
        return res.status(200).json(selectedSchedule)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorServices.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let deleteSelectedSchedule = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter!"
            })
        }
        let message = await doctorServices.deleteSelectedSchedule(req.body.id)
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        console.log('check input', req.query.doctorId)
        let infor = await doctorServices.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorServices.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorServices.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctors: postInforDoctors,
    getDetailedDoctorById: getDetailedDoctorById,
    getAllMarkdown: getAllMarkdown,
    bulkCreateSchedule: bulkCreateSchedule,
    getSelectedScheduleById: getSelectedScheduleById,
    getScheduleByDate: getScheduleByDate,
    deleteSelectedSchedule: deleteSelectedSchedule,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor
}