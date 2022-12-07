import db from "../models/index";
import bcrypt from "bcryptjs"
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        let tokenAccess = jwt.sign({ id: user.id, roleId: user.roleId }, process.env.JSON_SECRET_ACCESS, {
                            expiresIn: '30s'
                        });
                        let tokenRefresh = jwt.sign({ id: user.id, roleId: user.roleId }, process.env.JSON_SECRET_REFRESH, {
                            expiresIn: '2m'
                        });
                        await db.Refresh_Token.create(
                            {
                                refreshToken: tokenRefresh,
                                userId: user.id
                            })
                        userData.accessToken = tokenAccess;
                        userData.refreshToken = tokenRefresh;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = 'User is not found';
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = 'Your Email is not exist in this system. Please try again';
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else { resolve(false) }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
                if (users) {
                    users.forEach(element => {
                        if (element.image) {
                            element.image = new Buffer(element.image, 'base64').toString('binary');

                        }
                    });
                    // data.image = new Buffer(data.image, 'base64').toString('binary');
                }
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
                if (users && users.image) {
                    users.image = new Buffer(users.image, 'base64').toString('binary');
                }
            }

            resolve(users)
        } catch (e) {
            reject(e)

        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used.Try another one'
                })
            }
            else {
                let hashPasswordfrromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordfrromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: "This user is not exist"
            })
        }
        await user.destroy({
            where: { id: userId }
        });
        resolve({
            errCode: 0,
            message: "Completed"
        })
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters!"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                user.image = data.avatar;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Updated'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found!'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }

        } catch (e) {
            reject(e)
        }
    })
}
let handleRegister = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used. Plz check lai ho minh nha"
                })
            }
            else {
                let hashpassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashpassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    roleId: 'R3',
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleRefreshToken = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let info = await db.Refresh_Token.findOne({
                attributes: ['userId', 'refreshToken'],
                where: { refreshToken: data.refreshToken },
                include: [
                    {
                        model: db.User,
                        attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id']
                    }
                ],
                nest: true,
                raw: false
            });
            if (info) {
                let tokenAccess = jwt.sign({ id: info.User.id, roleId: info.User.roleId }, process.env.JSON_SECRET_ACCESS, {
                    expiresIn: '30s'
                });
                jwt.verify(info.refreshToken, process.env.JSON_SECRET_REFRESH, async (err, decoded) => {
                    if (err) {
                        let tokenRefresh = jwt.sign({ id: info.User.id, roleId: info.User.roleId }, process.env.JSON_SECRET_REFRESH, {
                            expiresIn: '2m'
                        });
                        await db.Refresh_Token.update(
                            {
                                refreshToken: tokenRefresh
                            },
                            {
                                where: { refreshToken: info.refreshToken }
                            })
                        resolve({
                            errCode: 0,
                            accessToken: tokenAccess,
                            refreshToken: tokenRefresh,
                            user: info.User,
                        })
                    }
                    resolve({
                        errCode: 0,
                        accessToken: tokenAccess,
                        refreshToken: info.refreshToken,
                        user: info.User
                    })
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'freshToken invalid'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    hashUserPassword, hashUserPassword,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    handleRegister: handleRegister,
    handleRefreshToken: handleRefreshToken
}