const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CaseAssignment = sequelize.define('CaseAssignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    caseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    officerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sharedFields: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
    },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return CaseAssignment;
};
