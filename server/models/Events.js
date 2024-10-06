module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define("Events", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Events.associate = (models) => {
    Events.hasMany(models.Songs, {
      onDelete: "cascade",
    });
  };

  return Events;
};
