'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ClinicSpecialty', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            clinicId:{
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            nameEn: {
                type: Sequelize.STRING
            },
            descriptionHTML: {
                type: Sequelize.TEXT
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            location: {
                type: Sequelize.STRING
            },
            locationEn: {
                type: Sequelize.STRING
            },
            priceId:{
                type: Sequelize.STRING
            },  
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ClinicSpecialty');
    }
};