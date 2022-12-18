import clinicServices from "../services/clinicServices"
let postNewClinic = async (req, res) => {
    try {
        let infor = await clinicServices.postNewClinic(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let updateClinicbyId = async (req, res) => {
    try {
        let infor = await clinicServices.updateClinicData(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllClinics = async (req, res) => {
    try {
        let infor = await clinicServices.getAllClinics();
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicServices.getDetailClinicById(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let deleteClinicById = async (req, res) => {
    try {
        let infor = await clinicServices.deleteClinicById(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    postNewClinic: postNewClinic,
    getAllClinics: getAllClinics,
    getDetailClinicById: getDetailClinicById,
    deleteClinicById: deleteClinicById,
    updateClinicbyId: updateClinicbyId
}