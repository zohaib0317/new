const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LegalCase = sequelize.define('LegalCase', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    legalOfficerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references:{
        model:"Users",
        key:"id"
      }
    },
    caseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
          model:"Cases",
          key:"id"
        }
      },
    displayFeild: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("Pending", "Verified", "Needs Review"),
        defaultValue: "Pending"
      },
      message: {
        type: DataTypes.STRING,
        
      },
    
  });

  return LegalCase;
};
