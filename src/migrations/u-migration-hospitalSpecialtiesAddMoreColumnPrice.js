module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('clinicspecialties', 'priceId', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ]
        )
    },
};