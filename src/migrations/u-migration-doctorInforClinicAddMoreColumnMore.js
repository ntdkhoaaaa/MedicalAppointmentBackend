module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('doctor_clinic_specialty', 'nameSpecialtyEn', {
                type: Sequelize.STRING,
                allowNull: false,
            })
        ]
        )
    },
};