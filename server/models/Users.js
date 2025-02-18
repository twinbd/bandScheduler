module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    login_token: {
      type: DataTypes.STRING,
      allowNull: true, // Allows null when not in use
    },
    token_expiry: {
      type: DataTypes.DATE,
      allowNull: true, // Allows null when not in use
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true, // Allows null if the user hasn't logged in yet
    },
    intro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });

    // Users.hasMany(models.Songs, {
    //   foreignKey: "requesterId",
    //   as: "RequestedSongs",
    // });
  };

  return Users;
};
