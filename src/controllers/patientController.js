import patientServices from "../services/patientServices"

let postBookingAppointment = async (req, res) => {
    try {
        let infor = await patientServices.postBookingAppointment(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postVerifyBooking = async (req, res) => {
    try {
        let infor = await patientServices.postVerifyBooking(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getBookingInfoByProfile = async (req, res) => {
    try {
        let infor = await patientServices.getBookingInfoByProfile(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBooking: postVerifyBooking,
    getBookingInfoByProfile: getBookingInfoByProfile
}