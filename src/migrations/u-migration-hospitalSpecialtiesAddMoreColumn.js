module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('clinicspecialties', 'locationEn', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
            queryInterface.addColumn('clinicspecialties', 'location', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ]
        )
    },
};