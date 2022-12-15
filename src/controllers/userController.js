import userService from "../services/userService"

require('dotenv').config();

const options = {
    expires: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
}
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    res.status(200).json(
        {
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken
        }
    )
    return res

}
let handleGetAllUser = async (req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message);

}
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
}
let updateUserInforInProfile = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserInforInProfile(data);
    return res.status(200).json(message);
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter!"
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message);
}
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        console.log(data)
        return res.status(200).json(data)

    }
    catch (e) {
        console.log('Get all code server ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        })
    }
}
let handleRegister = async (req, res) => {
    try {
        let userData = await userService.handleRegister(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
let handleRefreshToken = async (req, res) => {
    try {
        let data = await userService.handleRefreshToken(req.body);
        console.log('db', data)
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server',

        })
    }
}
let postVerifyRegister = async (req, res) => {
    try {
        console.log(req.body.token)
        let infor = await userService.postVerifyRegister(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleForgotPassword = async (req, res) => {
    try {
        let userData = await userService.handleForgotPassword(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
let handleInfoResetPasswordByToken = async (req, res) => {
    try {
        let userData = await userService.handleInfoResetPasswordByToken(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }

}
let handleResetPassword = async (req, res) => {
    try {
        let userData = await userService.handleResetPassword(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleRegister: handleRegister,
    handleRefreshToken: handleRefreshToken,
    updateUserInforInProfile: updateUserInforInProfile,
    postVerifyRegister: postVerifyRegister,
    handleForgotPassword: handleForgotPassword,
    handleInfoResetPasswordByToken: handleInfoResetPasswordByToken,
    handleResetPassword: handleResetPassword,

}