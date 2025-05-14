const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Case = sequelize.define('Case', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM(
        'Created',
        'Assigned',
        'Verified',
        'Collected',
        'Legal',
        'Complete'
      ),
      defaultValue: 'Created',
    },
    patientName: {
      type: DataTypes.STRING,
    },
    doi: {
      type: DataTypes.DATE,
    },
    cob: {
      type: DataTypes.STRING,
    },
    adjNumber: {
      type: DataTypes.STRING,
    },
    claimNumber: {
      type: DataTypes.STRING,
    },
    insuranceName: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID of the officer to whom this case is assigned'
    },

    assignedRole: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Role of the officer (e.g., Verification Officer)'
    },
    sharedFields: {
  type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: true
}

  });

  return Case;
};
