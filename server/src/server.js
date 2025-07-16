const express = require('express');
require("dotenv").config();
const sweetsRouter = require('./routes/sweetRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/sweets', sweetsRouter);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Sweet Shop API running on port ${PORT}`);
});
