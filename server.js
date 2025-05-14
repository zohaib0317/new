//require("dotenv").config();
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const allRoutes = require("./routes/index");
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require("./models/index");
const swaggerSpec = require('./swagger/swagger');


//
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));


// DB Connection and Seeding
sequelize.sync().then(async () => {
  console.log("Database Connected.!!");
});

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
allRoutes(app);

// Start the server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API DOCS: http://localhost:5007/api-docs`);
});