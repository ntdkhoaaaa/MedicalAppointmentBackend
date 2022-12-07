import _ from 'lodash';
const jwt = require("jsonwebtoken");
import db from "../models/index";

let verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization || req.body.token || req.query.token;
        console.log('token', token, typeof (token))
        if (!token) {
            return res.status(200).json({
                errCode: 2,
                role: 'R0'
            });
        }
        jwt.verify(token, process.env.JSON_SECRET_ACCESS, (err, decoded) => {
            if (err) {
                return res.status(200).json({
                    errCode: 3,
                    role: 'R0'
                });
            }
            req.body.authId = decoded.id;
            req.body.authRole = decoded.roleId;
            next();
        });

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
};
let checkPermissionByToken = async (req, res) => {
    try {
        let token = req.headers.authorization || req.body.token || req.query.token;
        console.log('token', token, typeof (token))
        if (!token) {
            return res.status(200).json({
                errCode: 2,
                role: 'R0'
            });
        }
        jwt.verify(token, process.env.JSON_SECRET_ACCESS, async (err, decoded) => {
            if (err) {
                return res.status(200).json({
                    errCode: 3,
                    role: 'R0'
                });
            }
            else {
                let data = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id'],
                    where: { id: decoded.id },
                    raw: true
                });
                return res.status(200).json({
                    errCode: 0,
                    role: decoded.roleId,
                    userInfo: data
                });
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',

        })

    }
};
let refreshToken = (req, res, next) => {
    try {
        let token = req.headers.authorization || req.body.token || req.query.token;
        console.log('token', token, typeof (token))
        if (!token) {
            return res.status(200).json({
                errCode: 2,
                role: 'R0'
            });
        }
        jwt.verify(token, process.env.JSON_SECRET, (err, decoded) => {
            if (err) {
                return res.status(200).json({
                    errCode: 3,
                    role: 'R0'
                });
            }
            req.body.authId = decoded.id;
            req.body.authRole = decoded.roleId;
            next();
        });

    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
};
module.exports = {
    verifyToken: verifyToken,
    checkPermissionByToken: checkPermissionByToken
}
