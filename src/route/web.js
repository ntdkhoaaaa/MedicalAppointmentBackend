import express from "express";

import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import authJwt from "../midlleware/authJwt";

let router = express.Router();
// let passport = require('passport');
let initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/ntdk', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.get('/api/get-all-user', userController.handleGetAllUser)
    router.get('/api/allcode', userController.getAllCode)

    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.post('/api/login', userController.handleLogin)
    router.post("/api/register", userController.handleRegister);

    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.put('/api/edit-user', userController.handleEditUser);
    router.put('/api/edit-on-own-user-infor', userController.updateUserInforInProfile);

    router.get('/api/get-top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', authJwt.verifyToken, doctorController.getAllDoctors)
    router.get('/api/get-detailed-doctor-byId', doctorController.getDetailedDoctorById);
    router.get('/api/get-all-markdown', doctorController.getAllMarkdown);
    router.get('/api/get-schedule-byDate', doctorController.getScheduleByDate);
    router.get('/api/get-selected-schedule-byId', authJwt.verifyToken, doctorController.getSelectedScheduleById)
    router.get('/api/get-extra-infor-doctor-byId', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-byId', doctorController.getProfileDoctorById)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctors);

    router.delete('/api/delete-selected-schedule', doctorController.deleteSelectedSchedule)


    router.post('/api/patient-booking-appointment', patientController.postBookingAppointment)
    router.post('/api/verify-booking', patientController.postVerifyBooking);

    router.post('/api/add-new-specialty', specialtyController.postNewSpecialty);
    router.get('/api/get-all-specialties', specialtyController.getAllSpecialities)
    router.get('/api/get-detail-specialty-byId', specialtyController.getDetailSpecialtyById)

    router.post('/api/add-new-clinic', clinicController.postNewClinic);
    router.get('/api/get-all-clinics', clinicController.getAllClinics);
    router.get('/api/get-detail-clinic-byId', clinicController.getDetailClinicById)


    router.get('/api/get-all-appointment-of-user', patientController.getBookingInfoByProfile)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);

    router.post('/api/cancel-booking', patientController.cancelBookingformPatient)

    // router.get(
    //     '/google/callback',
    //     passport.authenticate('google', {
    //         successRedirect: process.env.URL_REACT,
    //         failureRedirect: "/login/failed",

    router.get("/api/check-permission", authJwt.checkPermissionByToken);
    router.post('/api/refresh-token', userController.handleRefreshToken);


    //history
    router.post('/api/post-history-patient', doctorController.postHistoryPatient);
    router.get('/api/get-history-patient', doctorController.getHistoryPatient);

    return app.use("/", router)
}
module.exports = initWebRoute;