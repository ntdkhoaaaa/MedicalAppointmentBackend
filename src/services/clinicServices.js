import db from "../models/index";
require('dotenv').config();
let postNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // || !data.descriptionHTML || !data.descriptionMarkdown    
            if (!data.name || !data.imageBase64 || !data.nameEn
                || !data.descriptionHTML || !data.descriptionMarkdown
                || !data.address || !data.addressEn
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                await db.Clinics.create({
                    name: data.name,
                    nameEn: data.nameEn,
                    address: data.address,
                    addressEn: data.addressEn,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save patient booking success',
                    // data: data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
let getAllClinics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinics.findAll({
                attributes: {
                    exclude: ['descriptionMarkdown', 'descriptionHTML']
                },
            })
            if (clinics) {
                clinics.forEach(element => {
                    element.image = new Buffer(element.image, 'base64').toString('binary');
                });
            }
            resolve({
                errCode: 0,
                data: clinics
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postNewClinic: postNewClinic,
    getAllClinics: getAllClinics
}