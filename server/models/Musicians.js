module.exports = (sequelize, DataTypes) => {
  const Musicians = sequelize.define("Musicians", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Musicians.associate = (models) => {
  //   Musicians.belongsTo(models.Songs, {
  //     foreignKey: "SongId",
  //   });
  // };

  return Musicians;
};
