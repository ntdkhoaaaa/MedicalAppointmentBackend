import specialtyServices from "../services/specialtyServices"
let postNewSpecialty = async (req, res) => {
    try {
        let infor = await specialtyServices.postNewSpecialty(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllSpecialities = async (req, res) => {
    try {
        let infor = await specialtyServices.getAllSpecialities();
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    } screen
}
let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyServices.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    postNewSpecialty: postNewSpecialty,
    getAllSpecialities: getAllSpecialities,
    getDetailSpecialtyById: getDetailSpecialtyById
}