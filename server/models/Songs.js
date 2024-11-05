const moment = require("moment-timezone");

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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue("createdAt");
        return moment
          .tz(rawValue, "America/Los_Angeles")
          .format("YYYY-MM-DD HH:mm:ss");
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });

  Songs.associate = (models) => {
    Songs.hasMany(models.Musicians, {
      onDelete: "cascade",
    });

    // Song belongs to one user (the requester)
    Songs.belongsTo(models.Users, {
      foreignKey: "requesterId", // requesterId is the foreign key in Songs table
      as: "Requester", // Alias to make it clear this is the user who requested the song
    });
  };

  return Songs;
};
