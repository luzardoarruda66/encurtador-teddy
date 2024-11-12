import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import User from "./user";

class URL extends Model {
  public id!: number;
  public originalUrl!: string;
  public shortUrl!: string;
  public clicks!: number;
  public userId!: number;
}

URL.init(
  {
    originalUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "URL",
    paranoid: true,
  }
);

URL.belongsTo(User, { foreignKey: "userId" });

export default URL;
