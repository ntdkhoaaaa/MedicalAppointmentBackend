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
let getDetailClinicInAccountantSide = async (req, res) => {
    try {
        let infor = await clinicServices.getDetailClinicInAccountantSide(req.query.id);
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
let warningDuplicateMedicine = async (req, res) => {
    try {
        let infor = await clinicServices.warningDuplicateMedicine(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ' +e
        })
    }
}
let getMedicineByClinicId = async (req, res) => {
    try {
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
        let infor = await clinicServices.getMedicineById(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllDoctorOfClinic = async (req, res) => {
    try {
        let infor = await clinicServices.getAllDoctorOfClinic(req.body.clinicId,req.body.specialtyCode,req.body.positionCode);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let bulkCreateSchedulesForDoctors = async (req, res) => {
    try {
        let infor = await clinicServices.bulkCreateSchedulesForDoctors(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let createNewDoctorForClinic = async (req, res) => {
    try {
        let infor = await clinicServices.createNewDoctorForClinic(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let editDoctorClinicInfor = async (req, res) => {
    try {
        let infor = await clinicServices.editDoctorClinicInfor(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'+e
        })
    }
}
let handleDeleteDoctorClinic = async (req, res) => {
    if (!req.body.userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter!"
        })
    }
    let message = await clinicServices.deleteDoctorClinic(req.body.userId)
    return res.status(200).json(message);
}
module.exports = {
    bulkCreateSchedulesForDoctors:bulkCreateSchedulesForDoctors,
    postNewClinic: postNewClinic,
    getAllClinics: getAllClinics,
    getDetailClinicById: getDetailClinicById,
    deleteClinicById: deleteClinicById,
    addNewMedicine:addNewMedicine,
    getMedicineByClinicId:getMedicineByClinicId,
    deleteMedicineById:deleteMedicineById,
    editMedicineInfor:editMedicineInfor,
    getMedicineById:getMedicineById,
    updateClinicbyId: updateClinicbyId,
    warningDuplicateMedicine:warningDuplicateMedicine,
    getDetailClinicInAccountantSide:getDetailClinicInAccountantSide,
    getAllDoctorOfClinic:getAllDoctorOfClinic,
    createNewDoctorForClinic:createNewDoctorForClinic,
    editDoctorClinicInfor:editDoctorClinicInfor,
    handleDeleteDoctorClinic:handleDeleteDoctorClinic
}