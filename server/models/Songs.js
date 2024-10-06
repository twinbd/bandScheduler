module.exports = (sequelize, DataTypes) => {
  const Songs = sequelize.define("Songs", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Songs.associate = (models) => {
    Songs.hasMany(models.Musicians, {
      onDelete: "cascade",
    });
  };

  return Songs;
};
