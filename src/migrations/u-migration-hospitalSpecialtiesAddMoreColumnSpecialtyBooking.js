module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('Booking', 'specialtyId', {
                type: Sequelize.INTEGER,
                allowNull: true,
            })
        ]
        )
    },
};