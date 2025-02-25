import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import MainPage from '../pages/mainPage/MainPage';

import '../shared/styles/main.scss';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <MainPage />
    </Provider>,
  );
}
