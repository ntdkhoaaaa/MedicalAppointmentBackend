module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('medicine', 'medicineCode', {
                type: Sequelize.STRING,
                allowNull: false,
            })
        ])
    },
};