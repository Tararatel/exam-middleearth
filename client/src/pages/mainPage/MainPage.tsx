import React from 'react';
import MapWidget from '../../widgets/mapWidget/ui/MapWidget';
import RouteBuilder from '../../features/routeBuilder/ui/RouteBuilder';
import styles from './MainPage.module.scss';

function MainPage(): React.JSX.Element {
  return (
    <main>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Путь Фродо по Средиземью</h1>
        <MapWidget />
      </div>
      <RouteBuilder />
    </main>
  );
}

export default MainPage;
