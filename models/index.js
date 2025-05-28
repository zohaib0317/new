const { Sequelize, DataTypes } = require('sequelize');
const config = require('../db/config');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: config.development.dialect,
    dialectOptions: config.development.dialectOptions,
    logging: false,
  }
);

// Import Models
const User = require('./User')(sequelize, DataTypes);
const Case = require('./Case')(sequelize, DataTypes);
const Document = require('./Document')(sequelize, DataTypes);
const Comment = require('./Comment')(sequelize, DataTypes);
const verification = require('./verification')(sequelize, DataTypes); // This should return model named "verification"
const collection = require('./collection')(sequelize, DataTypes);
const legal = require('./legal')(sequelize, DataTypes);

// Define Relationships
User.hasMany(Case, { as: 'cases', foreignKey: 'createdBy' });
Case.belongsTo(User, { as: 'user', foreignKey: 'createdBy' });

Case.hasMany(Document, { foreignKey: 'caseId' });
Document.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(Document, { as: 'documents', foreignKey: 'uploadedBy' });
Document.belongsTo(User, { as: 'user', foreignKey: 'uploadedBy' });

Case.hasMany(Comment, { as: 'comments', foreignKey: 'caseId' });
Comment.belongsTo(Case, { as: 'case', foreignKey: 'caseId' });
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' });

// Verification Relationships
Case.hasMany(verification, { foreignKey: 'caseId' });
verification.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(verification, { foreignKey: 'officerId' });
verification.belongsTo(User, { foreignKey: 'officerId' });

// Collection Relationships
Case.hasMany(collection, { foreignKey: 'caseId' });
collection.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(collection, { foreignKey: 'officerId' });
collection.belongsTo(User, { foreignKey: 'officerId' });

// Legal Relationships
Case.hasMany(legal, { foreignKey: 'caseId' });
legal.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(legal, { foreignKey: 'officerId' });
legal.belongsTo(User, { foreignKey: 'officerId' });

// Export all models
module.exports = {
  sequelize,
  User,
  Case,
  Document,
  Comment,
  verification,
  collection,
  legal
};
