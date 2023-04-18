module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
                queryInterface.removeColumn('doctor_clinic_specialty', 'nameSpecialtyEn'),
                queryInterface.removeColumn('doctor_clinic_specialty', 'nameSpecialty')
        ]
        )
    },
};