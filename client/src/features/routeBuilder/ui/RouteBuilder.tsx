/* eslint-disable react/no-array-index-key */
import React from 'react';

import type { RootState } from '../../../app/store';
import { resetRoute } from '../model/routeBuilderSlice';
import type { UserRoute } from '../types/routeBuilderType';
import { verifyRoute } from '../lib/routeBuilderThunks';
import styles from './RouteBuilder.module.scss';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks';
import successVideo from '../assets/ok.mp4'
import failedVideo from '../assets/noOk.mp4';

function RouteBuilder(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { userRoute, result, loading, predefinedPoints } = useAppSelector(
    (state: RootState) => state.points,
  );

  const handleCheckRoute = (): void => {
    void dispatch(verifyRoute(userRoute));
  };

  const handleReset = (): void => {
    dispatch(resetRoute());
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Путь Хранителя Кольца</h3>
      <ul className={styles.list}>
        {userRoute.map((point: UserRoute, index: number) => (
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
        {predefinedPoints.map((point: UserRoute) => (
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
