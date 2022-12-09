import db from "../models/index";
require('dotenv').config();
let postNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // || !data.descriptionHTML || !data.descriptionMarkdown    
            if (!data.name || !data.imageBase64 || !data.nameEn) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    nameEn: data.nameEn,
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
let getAllSpecialities = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({
                attributes: {
                    exclude: ['descriptionMarkdown', 'descriptionHTML']
                },
            })
            if (specialties) {
                specialties.forEach(element => {
                    element.image = new Buffer(element.image, 'base64').toString('binary');
                });
                // data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            resolve({
                errCode: 0,
                data: specialties
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                if (location === 'ALL') {
                    let data = await db.Specialty.findOne({
                        where: {
                            id: id
                        },
                        attributes: ['descriptionHTML', 'descriptionMarkdown'],
                        include: [
                            { model: db.Doctor_Infor, as: 'specialtyData', attributes: { exclude: ['count'] } }
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
                else {
                    let data = await db.Specialty.findOne({
                        where: {
                            id: id,

                        },
                        attributes: ['descriptionHTML', 'descriptionMarkdown'],
                        include: [
                            { model: db.Doctor_Infor, as: 'specialtyData', where: { provinceId: location }, attributes: { exclude: ['count'] } }
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
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postNewSpecialty: postNewSpecialty,
    getAllSpecialities: getAllSpecialities,
    getDetailSpecialtyById: getDetailSpecialtyById
}