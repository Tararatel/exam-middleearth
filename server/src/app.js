const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pointRouter = require('./routes/pointRoutes')

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', pointRouter);

module.exports = app;
