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
            })
            // console.log(clinics)
            if (clinics) {
                clinics.forEach(element => {
                    if (element.image) {
                        element.image = new Buffer(element.image, 'base64').toString('binary');
                    }
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
let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let data = await db.Clinics.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                    include: [
                        { model: db.Doctor_Infor, as: 'clinicData', attributes: { exclude: ['count'] } }
                    ]
                })
                if (data) {
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        data: {}
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let deleteClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parametter'
                })
            } else {
                await db.Clinics.destroy({
                    where: {
                        id: id
                    }
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postNewClinic: postNewClinic,
    getAllClinics: getAllClinics,
    getDetailClinicById: getDetailClinicById,
    deleteClinicById: deleteClinicById
}