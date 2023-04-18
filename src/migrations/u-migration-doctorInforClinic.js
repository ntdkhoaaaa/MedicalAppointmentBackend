module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('doctor_clinic_specialty', 'count', {
                type: Sequelize.INTEGER,
                allowNull: false,
            })
        ]
        )
    },
};