import db from "../models/index";

const { Op } = require('sequelize')

let deleteFreshToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let a = await db.Refresh_Token.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: new Date(new Date() - (7 * 24 * 60 * 60 * 1000))
                    }
                }
            })
            resolve({
                err: 0,
                errCode: 'nope'
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    deleteFreshToken: deleteFreshToken,
}