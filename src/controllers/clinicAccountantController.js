import clinicAccountantServices from "../services/clinicAccountantServices"
let bulkCreateSchedulesForDoctors = async (req, res) => {
    try {
        console.log(req.body.arrSchedule)
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
module.exports ={
    bulkCreateSchedulesForDoctors:bulkCreateSchedulesForDoctors,
    getClinicWeekSchedules:getClinicWeekSchedules,
    createNewDoctor:createNewDoctor
}