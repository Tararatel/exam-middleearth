const { Point } = require('../../db/models');

const correctRouteNames = [
  'Shire',
  'Rivendell',
  'Moria',
  'Lothlorien',
  'Amon Hen',
  'Dead Marshes',
  'Minas Morgul',
  'Mordor',
];

const pointService = {
  async getAllPoints() {
    const points = await Point.findAll();
    return points;
  },

  async checkUserRoute(userRoute) {
    const correctRoute = await Point.findAll({
      where: { name: correctRouteNames },
      order: [['id', 'ASC']],
    });

    let isCorrect = true;
    for (let i = 0; i < correctRoute.length; i++) {
      const correctPoint = correctRoute[i];
      const userPoint = userRoute[i];
      if (
        !userPoint ||
        Math.abs(userPoint.latitude - correctPoint.latitude) > 100 ||
        Math.abs(userPoint.longitude - correctPoint.longitude) > 100
      ) {
        isCorrect = false;
        break;
      }
    }

    return {
      success: isCorrect,
      message: isCorrect ? 'Кольцо уничтожено!' : 'Фродо выжил, но миссия провалена',
    };
  },
};

module.exports = pointService;
