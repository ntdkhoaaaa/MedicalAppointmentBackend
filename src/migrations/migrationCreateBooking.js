'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Booking', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            doctorId: {
                type: Sequelize.INTEGER
            },
            clinicId: {
                type: Sequelize.INTEGER
            },
            patientId: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.STRING
            },
            timetype: {
                type: Sequelize.STRING
            },
            prognostic: {
                type: Sequelize.STRING
            },
            forWho: {
                type: Sequelize.STRING
            },
            bookingDate: {
                type: Sequelize.STRING
            },
            patientAge: {
                type: Sequelize.STRING
            },
            token: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.STRING
            },
            height: {
                type: Sequelize.STRING
            },
            weight: {
                type: Sequelize.STRING
            },
            bloodType: {
                type: Sequelize.STRING
            },
            pathology: {
                type: Sequelize.STRING
            },
            phoneNumber: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Booking');
    }
};