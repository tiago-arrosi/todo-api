module.exports= function(sequelize, dataTypes) {
  return sequelize.define('user', {
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        len: [7,100]
      }
    }
  });
}
