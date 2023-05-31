'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Doctor_Infor', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctorId: {
                type: Sequelize.INTEGER,
                allowNull: false,

            },
            clinicId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            specialtyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            priceId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            provinceId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            paymentId: {
                type: Sequelize.STRING,
            },
            addressClinic: {
                type: Sequelize.STRING,
            },
            nameClinic: {
                type: Sequelize.STRING,
            },
            nameSpecialty: {
                type: Sequelize.STRING,
            },
            nameSpecialtyEn:{
                type: Sequelize.STRING,
            },
            note: {
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0

            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Doctor_Infor');
    }
};