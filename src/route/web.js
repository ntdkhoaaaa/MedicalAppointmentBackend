import express from "express";

import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
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

    router.get('/api/get-top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.get('/api/get-detailed-doctor-byId', doctorController.getDetailedDoctorById);
    router.get('/api/get-all-markdown', doctorController.getAllMarkdown);
    router.get('/api/get-schedule-byDate', doctorController.getScheduleByDate);
    router.get('/api/get-selected-schedule-byId', doctorController.getSelectedScheduleById)
    router.get('/api/get-extra-infor-doctor-byId', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-byId', doctorController.getProfileDoctorById)

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
    // router.get(
    //     '/google/callback',
    //     passport.authenticate('google', {
    //         successRedirect: process.env.URL_REACT,
    //         failureRedirect: "/login/failed",

    //     })
    // );
    // router.get('/google', passport.authenticate('google', ['profile', 'email']))
    // router.get('/logout', (req, res) => {
    //     req.logout();
    //     res.redirect(process.env.URL_REACT)
    // })
    // router.get('/login/failed', (req, res) => {
    //     if (req.user) {
    //         res.status(200).json({
    //             error: false,
    //             message: "Successfully logged in",
    //             user: req.user
    //         });
    //     } else {
    //         res.status(403).json({
    //             error: true,
    //             message: "Not Authorized",
    //         });
    //     }
    // })
    // router.get('/login/failed', (req, res) => {
    //     res.status(401).json({
    //         error: true,
    //         message: "Log in failure",
    //     });
    // })

    return app.use("/", router)
}
module.exports = initWebRoute;