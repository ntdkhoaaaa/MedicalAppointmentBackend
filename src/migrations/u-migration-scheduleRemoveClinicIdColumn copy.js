module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
                queryInterface.removeColumn('schedules', 'clinicId'),
        ]
        )
    },
};