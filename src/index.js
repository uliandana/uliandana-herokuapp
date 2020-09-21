import React from 'react';
import { render } from 'react-dom';
import 'typeface-ubuntu';
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
        <NewApp history={history} store={store} />,
        document.getElementById('app')
      );
    });
  }
}
