module.exports = (sequelize, DataTypes) => {
  const Constraints = sequelize.define("Constraints", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unavailableTime: {
      type: DataTypes.INTEGER,
      allowNull: false, // Values range from 1 to 20
    },
  });

  Constraints.associate = (models) => {
    Constraints.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "cascade",
    });

    Constraints.belongsTo(models.Events, {
      foreignKey: "eventId",
      onDelete: "cascade",
    });
  };

  return Constraints;
};
