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

let deleteSpecialtyById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parametter'
                })
            } else {
                await db.Specialty.destroy({
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
let updateSpecialtyData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.imageBase64 || !data.nameEn
                || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }
            let specialty = await db.Specialty.findOne({
                where: { id: data.id },
            })
            if (specialty) {
                specialty.name = data.name;
                specialty.nameEn = data.nameEn;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                specialty.image = data.imageBase64;
                await specialty.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Updated'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'specialty not found!'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
let AddNewSpecialtiesOfClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // || !data.descriptionHTML || !data.descriptionMarkdown    
            if (!data.name || !data.imageBase64 || !data.nameEn 
                ||!data.clinicId||!data.location||!data.locationEn
                || !data.priceId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {                
                await db.ClinicSpecialties.create({
                    name: data.name,
                    nameEn: data.nameEn,
                    image: data.imageBase64,
                    clinicId: data.clinicId,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    location:data.location,
                    locationEn:data.locationEn,
                    priceId: data.priceId
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save new specialties success',
                    // data: data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
let getAllSpecialitiesOfClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.ClinicSpecialty.findAll({
                where:{clinicId:data}
            })
            if (specialties) {
                specialties.forEach(element => {
                    element.image = new Buffer(element.image, 'base64').toString('binary');
                });
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

let deleteClinicSpecialtyById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parametter'
                })
            } else {
                await db.ClinicSpecialty.destroy({
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
let updateClinicSpecialtyData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.imageBase64 || !data.nameEn
                || !data.descriptionHTML || !data.descriptionMarkdown
                ||!data.location||!data.locationEn
                ||!data.priceId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }
            let specialty = await db.ClinicSpecialty.findOne({
                where: { id: data.id },
            })
            if (specialty) {
                specialty.name = data.name;
                specialty.nameEn = data.nameEn;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                specialty.image = data.imageBase64;
                specialty.location=data.location;
                specialty.locationEn=data.locationEn;
                specialty.priceId=data.priceId
                await specialty.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Updated'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'specialty not found!'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postNewSpecialty: postNewSpecialty,
    getAllSpecialities: getAllSpecialities,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialtyById: deleteSpecialtyById,
    updateSpecialtyData: updateSpecialtyData,
    AddNewSpecialtiesOfClinic:AddNewSpecialtiesOfClinic,
    getAllSpecialitiesOfClinic:getAllSpecialitiesOfClinic,
    deleteClinicSpecialtyById:deleteClinicSpecialtyById,
    updateClinicSpecialtyData:updateClinicSpecialtyData
}