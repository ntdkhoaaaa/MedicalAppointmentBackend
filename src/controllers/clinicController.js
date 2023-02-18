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
let addNewMedicine = async (req, res) => {
    try {
        console.log(req.body)
        let infor = await clinicServices.addNewMedicine(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errReq:req.body,
            errCode: -1,
            errMessage: 'Error from server ' +e
        })
    }
}
let getMedicineByClinicId = async (req, res) => {
    try {
        console.log('',req.query)
        let infor = await clinicServices.getMedicineByClinicId(req.query.clinicId);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let deleteMedicineById = async (req, res) => {
    try {
        let infor = await clinicServices.deleteMedicineById(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let editMedicineInfor = async (req, res) => {
    try {
        let data=req.body;
        let infor = await clinicServices.editMedicineInfor(data);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getMedicineById = async (req, res) => {
    try {
        console.log('check medicine id',req.query)
        let infor = await clinicServices.getMedicineById(req.query.id);
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
    addNewMedicine:addNewMedicine,
    getMedicineByClinicId:getMedicineByClinicId,
    deleteMedicineById:deleteMedicineById,
    editMedicineInfor:editMedicineInfor,
    getMedicineById:getMedicineById,
    updateClinicbyId: updateClinicbyId
}