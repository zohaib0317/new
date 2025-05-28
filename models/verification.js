module.exports = (sequelize, DataTypes) => {
  const verification = sequelize.define('verification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    officerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    },
    caseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Cases",
        key: "id"
      }
    },
    sharedFields: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Pending", "Verified", "Needs Review"),
      defaultValue: "Pending"
    },
    message: {
      type: DataTypes.STRING
    }
  });

  return verification;
};
