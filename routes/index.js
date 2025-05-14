const authMiddleware = require('../middleware/authMiddleware');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const caseRoutes = require('./caseRoutes')
const verificationOfficerRoute = require('./verificationOfficerRoute');
const CollectionOfficerRoute = require('./collectionOfficerRoute');
const legalOfficerRoute = require('./legalOfficerRoute');
const API_PREFIX_V1 = `/api/v1`;
module.exports = (app) => {
  console.log("hello world1")

  app.use(`${API_PREFIX_V1}/auth`, authRoutes);
  app.use(`${API_PREFIX_V1}/users`, userRoutes);

  console.log("hello world")
  app.use(`${API_PREFIX_V1}/case`, caseRoutes)
app.use('/api/v1/verification', verificationOfficerRoute);
app.use(`${API_PREFIX_V1}/collection`, CollectionOfficerRoute);
app.use(`${API_PREFIX_V1}/legal`, legalOfficerRoute);
};
