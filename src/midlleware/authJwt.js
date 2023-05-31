import _ from "lodash";
const jwt = require("jsonwebtoken");
import db from "../models/index";
const Sequelize = require("sequelize");

let verifyToken = (req, res, next) => {
  try {
    let authHeader =
      req.headers.authorization || req.body.token || req.query.token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(200).json({
        errCode: 2,
        role: "R0",
      });
    }
    let token = authHeader.substring(7, authHeader.length);
    jwt.verify(token, process.env.JSON_SECRET_ACCESS, (err, decoded) => {
      if (err) {
        return res.status(200).json({
          errCode: 3,
          role: "R0",
        });
      }
      req.body.authId = decoded.id;
      req.body.authRole = decoded.roleId;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let checkPermissionByToken = async (req, res) => {
  try {
    let authHeader =
      req.headers.authorization || req.body.token || req.query.token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(200).json({
        errCode: 2,
        role: "R0",
      });
    }
    let token = authHeader.substring(7, authHeader.length);
    jwt.verify(token, process.env.JSON_SECRET_ACCESS, async (err, decoded) => {
      if (err) {
        return res.status(200).json({
          errCode: 3,
          role: "R0",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: decoded.id },
          include: [
            {
              model: db.Doctor_Infor,
              attributes: ["clinicId"],
            },
            {
              model: db.UserMedicalInformation,
              attributes: [],
            },
          ],
          attributes: [
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
            "id",
            "clinicId",
            "phoneNumber",
            "address",
            "gender",
            [Sequelize.literal('"UserMedicalInformation"."height"'), "height"],
            [Sequelize.literal('"UserMedicalInformation"."weight"'), "weight"],
            [
              Sequelize.literal('"UserMedicalInformation"."bloodType"'),
              "bloodType",
            ],
            [
              Sequelize.literal(
                `replace("UserMedicalInformation"."pathology",'\\n', E'\\n')`
              ),
              "pathology",
            ],
          ],

          raw: true,
          nest: true,
        });
        
        return res.status(200).json({
          errCode: 0,
          role: decoded.roleId,
          userInfo: data,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
module.exports = {
  verifyToken: verifyToken,
  checkPermissionByToken: checkPermissionByToken,
};
