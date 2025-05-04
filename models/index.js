const { Sequelize } = require('sequelize');
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


module.exports = { sequelize, User, Case, Document, Comment };
