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
const User = require('./User')(sequelize);
const Case = require('./Case')(sequelize);
const Document = require('./Document')(sequelize);
const Comment = require('./Comment')(sequelize);
const verification = require('./verification')(sequelize)
const collection=require('./collection')(sequelize)
const legal=require('./legal')(sequelize)
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


Case.hasMany(verification, { foreignKey: 'caseId' });
verification.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(verification, { foreignKey: 'officerId' });
verification.belongsTo(User, { foreignKey: 'officerId' });

Case.hasMany(collection, { foreignKey: 'caseId' });
collection.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(collection, { foreignKey: 'officerId' });
collection.belongsTo(User, { foreignKey: 'officerId' })

Case.hasMany(legal, { foreignKey: 'caseId' });
legal.belongsTo(Case, { foreignKey: 'caseId' });

User.hasMany(legal, { foreignKey: 'officerId' });
legal.belongsTo(User, { foreignKey: 'officerId' });


module.exports = { sequelize, User, Case, Document, Comment,verification,legal,collection};
