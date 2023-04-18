import express from "express";

import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import authJwt from "../midlleware/authJwt";
import clinicAccountantController from "../controllers/clinicAccountantController";
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
    //register
    router.post("/api/register", userController.handleRegister);
    router.post('/api/verify-register', userController.postVerifyRegister);

    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.put('/api/edit-user', userController.handleEditUser);
    router.put('/api/edit-on-own-user-infor', userController.updateUserInforInProfile);

    router.get('/api/get-top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', authJwt.verifyToken, doctorController.getAllDoctors)
    router.get('/api/get-detailed-doctor-byId', doctorController.getDetailedDoctorById);
    router.get('/api/get-all-markdown', doctorController.getAllMarkdown);
    router.get('/api/get-schedule-byDate', doctorController.getScheduleByDate);
    router.get('/api/get-schedule-byDate-contain-userId', doctorController.getScheduleByDateContainUserId);
    router.get('/api/get-selected-schedule-byId', authJwt.verifyToken, doctorController.getSelectedScheduleById)
    router.get('/api/get-extra-infor-doctor-byId', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-byId', doctorController.getProfileDoctorById)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctors);

    router.delete('/api/delete-selected-schedule', doctorController.deleteSelectedSchedule)


    router.post('/api/patient-booking-appointment', patientController.postBookingAppointment)
    router.post('/api/verify-booking', patientController.postVerifyBooking);
    //specialty
    router.post('/api/add-new-specialty', specialtyController.postNewSpecialty);
    router.post('/api/add-new-specialties-of-clinic', specialtyController.AddNewSpecialtiesOfClinic);
    router.get('/api/get-all-specialties', specialtyController.getAllSpecialities)
    router.post('/api/get-all-specialties-of-clinic', specialtyController.getAllSpecialitiesOfClinic)
    router.get('/api/get-detail-specialty-byId', specialtyController.getDetailSpecialtyById)
    router.get('/api/delete-specialty-by-id', specialtyController.deleteSpecialtyById)
    router.post('/api/update-specialty-by-id', specialtyController.updateSpecialtyData);
    router.get('/api/delete-clinic-specialty-by-id', specialtyController.deleteClinicSpecialtyById)
    router.post('/api/update-clinic-specialty-by-id', specialtyController.updateClinicSpecialtyData);

    //clinic
    router.post('/api/add-new-clinic', clinicController.postNewClinic);
    router.post('/api/create-bulk-schedules-for-doctors', clinicAccountantController.bulkCreateSchedulesForDoctors);
    router.get('/api/get-all-clinics', clinicController.getAllClinics);
    router.get('/api/get-detail-clinic-byId', clinicController.getDetailClinicById)
    router.get('/api/get-detail-clinic-byId-in-accountantside', clinicController.getDetailClinicInAccountantSide)
    router.get('/api/delete-clinic-by-id', clinicController.deleteClinicById)

    router.post('/api/add-new-medicine', clinicController.addNewMedicine)
    router.get('/api/get-medicine-by-clinicId', clinicController.getMedicineByClinicId)
    router.post('/api/check-dulicate-medicine', clinicController.warningDuplicateMedicine)
    router.delete('/api/delete-medicine-by-id', clinicController.deleteMedicineById)
    router.put('/api/edit-medicine-infor', clinicController.editMedicineInfor);
    router.get('/api/get-medicine-by-Id', clinicController.getMedicineById)
    
    router.post('/api/get-all-doctor-clinic', clinicController.getAllDoctorOfClinic);
    router.post('/api/get-clinic-week-schedules', clinicAccountantController.getClinicWeekSchedules);
    router.post('/api/get-doctor-week-schedules', doctorController.getScheduleForWeek);
    router.post('/api/create-new-doctor', clinicAccountantController.createNewDoctor);
    router.post('/api/get-all-doctors-hospital', clinicAccountantController.getAllDoctorOfHospital);
    router.post('/api/edit-doctor-hospital', clinicAccountantController.editDoctorInfor);
    router.post('/api/delete-doctor', clinicAccountantController.handleDeleteUser);

    router.post('/api/create-new-clinic-doctor', clinicController.createNewDoctorForClinic);
    router.post('/api/edit-doctor-clinic', clinicController.editDoctorClinicInfor);
    router.post('/api/delete-doctor-clinic', clinicController.handleDeleteDoctorClinic);


    router.post('/api/update-clinic-by-id', clinicController.updateClinicbyId);


    router.get('/api/get-all-appointment-of-user', patientController.getBookingInfoByProfile)
    router.get('/api/get-list-examinated-patient-for-doctor', doctorController.getListExaminatedPatientForDoctor);

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

    //rating
    router.post('/api/post-rating-patient', patientController.postRatingPatient);
    router.get('/api/get-rating-patient', doctorController.getRatingDoctor);


    //api get schedule from doctor
    router.get('/api/get-schedule-by-date-from-doctor', doctorController.getScheduleByDateFromDoctor);

    //forgot password
    router.post('/api/forgot-password', userController.handleForgotPassword);
    router.post('/api/get-info-reset-password-by-token', userController.handleInfoResetPasswordByToken);
    router.post('/api/reset-password', userController.handleResetPassword);


    router.get('/api/get-data-search', patientController.getDataSearch);

    return app.use("/", router)
}
module.exports = initWebRoute;