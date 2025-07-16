const express = require('express');
require("dotenv").config();
const cors = require("cors")
const sweetsRouter = require('./routes/sweetRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.use('/sweets', sweetsRouter);
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Sweet Shop API running on port ${PORT}`);
});
