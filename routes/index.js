const authMiddleware = require('../middleware/authMiddleware');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const VerificationOfficerRoute = require('./verificationOfficerRoute')
const caseRoutes = require('./caseRoutes')
const CollectionOfficerRoute=require('./collectionOfficerRoute')
const legalOfficerRoute=require('./legalOfficerRoute')
const API_PREFIX_V1 = `/api/v1`;
module.exports = (app) => {
  app.use(`${API_PREFIX_V1}/auth`, authRoutes);
  app.use(`${API_PREFIX_V1}/users`, userRoutes);
  app.use(`${API_PREFIX_V1}/verification`,VerificationOfficerRoute);
  app.use(`${API_PREFIX_V1}/case`,caseRoutes);
  app.use(`${API_PREFIX_V1}/collection`,CollectionOfficerRoute)
 app.use(`${API_PREFIX_V1}legal`,legalOfficerRoute)
};
