module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            [
                queryInterface.changeColumn('booking', ['patientId'],{
                    type:Sequelize.INTEGER
                }),
        ]
        )
    },
};