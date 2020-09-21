import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { Router } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/elements/ErrorBoundary';
import pages from './pages';
import { checkExpireTime, clearStorages, getToken } from './utils/storage';
import ContextProvider from './contexts';

if (!('scrollBehavior' in document.documentElement.style)) {
  import('scroll-behavior-polyfill');
}

const App = ({ history, store }) => {
  if (getToken() && checkExpireTime()) {
    clearStorages();
    location.reload();
    return null;
  }
  return (
    <Provider store={store}>
      <Router history={history}>
        <ErrorBoundary>
          <ContextProvider>
            <Switch>
              <Route component={pages.Home} exact path="/" />
              <Route component={pages.Error404} />
            </Switch>
          </ContextProvider>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};

export default hot(App);

App.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};
