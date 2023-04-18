module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('doctor_infor', 'nameSpecialtyEn', {
                type: Sequelize.STRING,
                allowNull: false,
            })
        ]
        )
    },
};