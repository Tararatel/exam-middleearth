const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    static associate() {
    }
  }

  Point.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Point',
      tableName: 'Points',
    },
  );

  return Point;
};
