module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn("Booking", "height", {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ],
      [
        queryInterface.addColumn("Booking", "weight", {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ],
      [
        queryInterface.addColumn("Booking", "bloodType", {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ],
      [
        queryInterface.addColumn("Booking", "pathology", {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ]
    );
  },
};
