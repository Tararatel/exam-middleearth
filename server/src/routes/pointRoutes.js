const express = require('express');
const pointController = require('../controllers/pointController');
const pointRouter = express.Router();

pointRouter.get('/points', pointController.getPoints);
pointRouter.post('/check-route', pointController.checkRoute);

module.exports = pointRouter;
