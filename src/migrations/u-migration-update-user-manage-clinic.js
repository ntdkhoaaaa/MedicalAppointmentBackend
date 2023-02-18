module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('Users', 'clinicId', {
                type: Sequelize.INTEGER,
                allowNull: true,
            })
        ])
    },
};