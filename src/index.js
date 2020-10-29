import React from 'react';
import 'fontsource-ubuntu/latin.css';
import { render } from 'react-dom';
import configureStore, { history } from './store/configureStore';
import App from './App';
import './App.css';
import './favicon.ico';
const store = configureStore();

render(
  <App history={history} store={store} />,
  document.getElementById('app')
);

moduleHotAccept(module);

export function moduleHotAccept(mod) {
  if (mod.hot) {
    mod.hot.accept('./App', () => {
      const NewApp = require('./App').default;
      render(
        NewApp({ history, store }),
        document.getElementById('app')
      );
    });
  }
}
