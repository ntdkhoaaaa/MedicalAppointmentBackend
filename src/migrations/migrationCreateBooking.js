'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('booking', {
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
        await queryInterface.dropTable('booking');
    }
};