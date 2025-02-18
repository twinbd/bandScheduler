module.exports = (sequelize, DataTypes) => {
  const Signups = sequelize.define("Signups", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Signups;
};
