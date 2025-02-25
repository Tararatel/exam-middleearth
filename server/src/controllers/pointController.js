const pointService = require('../services/pointService');

const pointController = {
  async getPoints(req, res) {
    try {
      const points = await pointService.getAllPoints();
      res.status(200).json(points);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера', message: error.message });
    }
  },

  async checkRoute(req, res) {
    try {
      const userRoute = req.body.route;
      const result = await pointService.checkUserRoute(userRoute);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка проверки маршрута', message: error.message });
    }
  },
};

module.exports = pointController;
