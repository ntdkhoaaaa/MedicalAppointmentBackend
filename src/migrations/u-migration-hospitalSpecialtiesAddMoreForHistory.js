module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
            queryInterface.addColumn('histories', 'date', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ]
        )
    },
};