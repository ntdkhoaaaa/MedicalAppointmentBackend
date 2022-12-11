require('dotenv').config();
import nodemailer from "nodemailer";

let sendEmailSimple = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        // receiverMail: data.email,
        // patientName: data.fullName,
        // time: data.bookingDate,
        // language: data.language
        from: '"KMP MEDICAL APPOINTMENT SYSTEM 👻" <ntdkhoaforwork@gmail.com>', // sender address
        to: data.receiverMail, // list of receivers
        subject: data.language === 'vi' ? `XÁC NHẬN THÔNG TIN ĐẶT LỊCH KHÁM BỆNH TRÊN HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH KMP` :
            `CONFIRMING INFORMATION BOOKING MEDICAL EXAMINATION ON KMP MEDICAL EXAMINATION SCHEDULE SYSTEM`, // Subject line
        html: getBodyHTML(data), // html body
    });
}
let getBodyHTML = (data) => {
    let result = '';
    if (data.language === 'vi') {
        result =
            `
        <h3>${data.patientName} thân mến ✔ </h3>
        <p> Đây là email tự động được gửi từ hệ thống đặt lịch khám bệnh KMP nhằm xác nhận việc đặt lịch khám bệnh của bạn 
        trên nền tảng của chúng tôi</p>
        <b>Thông tin đặc lịch khám bệnh của bạn như sau:</b>
        <div><b>Bác sĩ: ${data.doctorName}</b></div>
        <div><b>Thời gian khám bệnh: ${data.time}</b></div>
        <p>Nếu những thông tin chúng tôi cung cấp ở trên đúng sự thật thì xin mời bạn vui lòng click vào đường link bên dưới 
        để xác nhận lịch hẹn và hoàn tất các thủ tục đầu tiên để việc thăm khám diễn ra tốt nhất</p>
        <div>
            <a href=${data.confirmlink} target="_blank">Click here</a>
        </div>
        <p>Trân trọng</p>`
    }
    else {
        result = `
        <h3>Dear  ${data.patientName}✔ </h3>
        <p> This is an automated email sent from KMP's appointment booking system to confirm your appointment
        on our platform</p>
        <b>Your appointment details are as follows:</b>
        <div><b>Doctor: ${data.doctorName}</b></div>
        <div><b>Medical examination time: ${data.time}</b></div>
        <p>If the information we provide above is correct, please click on the link below
        to confirm the appointment and complete the first procedures to make the best visit</p>
        <div>
            <a href=${data.confirmlink} target="_blank">Click here</a>
        </div>
        <p>Best regards</p>
        `
    }
    return result
}
let sendEmailCancelSchedule = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        // receiverMail: data.email,
        // patientName: data.fullName,
        // time: data.bookingDate,
        // language: data.language
        from: '"KMP MEDICAL APPOINTMENT SYSTEM 👻" <ntdkhoaforwork@gmail.com>', // sender address
        to: data.receiverMail, // list of receivers
        subject: `THÔNG BÁO HỦY LỊCH HẸN `, // Subject line
        html: getbodyHTMLCancelPatient(data), // html body
    });
}
let getbodyHTMLCancelPatient = (data) => {
    let result = '';

    result =
        `
        <h3>${data.patientName} thân mến ✔ </h3>
        <p> Đây là email tự động được gửi từ hệ thống đặt lịch khám bệnh KMP nhằm thông báo bạn đã hủy lịch hẹn thành công</p>
        <b>Thông tin lịch khám bệnh của bạn như sau:</b>
        <div><b>Bác sĩ: ${data.doctorName}</b></div>
        <div><b>Thời gian khám bệnh: ${data.time}</b></div>
        <p>Cảm ơn bạn đã sử dụng hệ thống đặt lịch khám bệnh KMP</p>
        <p>Trân trọng</p>`

    return result
}
module.exports = {
    sendEmailSimple: sendEmailSimple,
    getBodyHTML: getBodyHTML,
    sendEmailCancelSchedule: sendEmailCancelSchedule,
    getbodyHTMLCancelPatient: getbodyHTMLCancelPatient
}