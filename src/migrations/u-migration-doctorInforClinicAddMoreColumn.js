module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('doctor_clinic_specialty', 'nameSpecialty', {
                type: Sequelize.STRING,
                allowNull: false,
            })
        ]
        )
    },
};