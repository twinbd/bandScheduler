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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0 = Requested, 1 = Accepted, 2 = Rejected
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false, // The ID of the user who requested the musician
    },
  });
  // Musicians.associate = (models) => {
  //   Musicians.belongsTo(models.Songs, {
  //     foreignKey: "SongId",
  //   });
  // };
  // Associate Musicians with Songs and Users
  Musicians.associate = (models) => {
    // Associate Musicians with Users (the requester)
    Musicians.belongsTo(models.Users, {
      foreignKey: "requesterId",
      as: "Requester",
    });
  };

  return Musicians;
};
