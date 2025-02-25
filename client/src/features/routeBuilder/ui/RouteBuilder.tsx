/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import styles from './RouteBuilder.module.scss';
import successVideo from '../assets/ok.mp4';
import failedVideo from '../assets/noOk.mp4';

// Моковые данные для предопределённых точек
// TODO: Замените эти данные на получение из RTK с помощью useAppSelector
const mockPredefinedPoints: Point[] = [
  { name: 'Shire', latitude: 756, longitude: 426, description: 'Мирные земли хоббитов' },
  { name: 'Rivendell', latitude: 776, longitude: 760, description: 'Эльфийский приют' },
  { name: 'Mordor', latitude: 290, longitude: 1110, description: 'Темная земля Саурона' },
];

type Point = {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
};

type Result = {
  success: boolean;
  message: string;
};

function RouteBuilder(): React.JSX.Element {
  // TODO: Замените useState на useAppSelector для получения userRoute, result, loading из RTK
  // TODO: Получите predefinedPoints из RTK
  const [userRoute, setUserRoute] = useState<Point[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const predefinedPoints = mockPredefinedPoints;

  // TODO: Замените этот обработчик
  const handleCheckRoute = (): void => {
    console.log('Check route');
  };

  // TODO: Замените этот обработчик
  const handleReset = (): void => {
    console.log('Reset route');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Путь Хранителя Кольца</h3>
      <ul className={styles.list}>
        {userRoute.map((point: Point, index: number) => (
          <li className={`${styles.listItem} ${styles.routeItem}`} key={index}>
            {`Шаг ${(index + 1).toFixed(0)}: [${point.latitude.toFixed(
              0,
            )}, ${point.longitude.toFixed(0)}]`}
          </li>
        ))}
      </ul>
      <div className={styles.buttonContainer}>
        <button
          className={loading || userRoute.length < 2 ? styles.buttonDisabled : styles.button}
          onClick={handleCheckRoute}
          disabled={loading || userRoute.length < 2}
        >
          Отправить Фродо в путь
        </button>
        <button className={styles.button} onClick={handleReset}>
          Вернуться в Шир
        </button>
      </div>
      {result && (
        <>
          <p className={`${styles.result} ${result.success ? styles.success : styles.error}`}>
            {result.message}
          </p>
          {result.success ? (
            <video className={styles.video} autoPlay loop>
              <source src={successVideo} type="video/mp4" />
            </video>
          ) : (
            <video className={styles.video} autoPlay loop>
              <source src={failedVideo} type="video/mp4" />
            </video>
          )}
        </>
      )}
      <h3 className={styles.title}>Знания Средиземья</h3>
      <ul className={styles.list}>
        {predefinedPoints.map((point: Point) => (
          <li className={styles.listItem} key={point.name}>
            <span className={styles.name}>{point.name}</span>
            {`: [${point.latitude.toFixed(0)}, ${point.longitude.toFixed(0)}]`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteBuilder;
