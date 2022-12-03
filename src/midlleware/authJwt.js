import _ from 'lodash';
const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
    try {
        let token = req.headers || req.body.token || req.query.token;
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
let checkPermissionByToken = (req, res) => {
    try {
        console.log("vao dayyy")
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
            let authRole = decoded.roleId;
            if (authRole === 'R1' || authRole === 'R2' || authRole === 'R3') {
                return res.status(200).json({
                    errCode: 0,
                    role: authRole
                })
            } else {
                return res.status(200).json({
                    errCode: 0,
                    role: 'R0'
                })
            }
        });
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
};
// let isAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRoles().then((roles) => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].roleName === "administrator") {
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({
//                 message: "Require Admin Role!",
//             });
//             return;
//         });
//     });
// };
// let isModerator = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRoles().then((roles) => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].roleName === "moderator") {
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({
//                 message: "Require Moderator Role!",
//             });
//         });
//     });
// };
// let isModeratorOrAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRoles().then((roles) => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].roleName === "moderator") {
//                     next();
//                     return;
//                 }
//                 if (roles[i].roleName === "admin") {
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({
//                 message: "Require Moderator or Admin Role!",
//             });
//         });
//     });
// };
module.exports = {
    verifyToken: verifyToken,
    checkPermissionByToken: checkPermissionByToken
}
