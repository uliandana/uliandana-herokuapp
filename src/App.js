import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { Router } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/elements/ErrorBoundary';
import pages from './pages';
import { checkExpireTime, clearStorages, getToken, setExpireTime, setToken } from './utils/storage';
import ContextProvider from './contexts';

if (!('scrollBehavior' in document.documentElement.style)) {
  import('scroll-behavior-polyfill');
}

const App = ({ history, store }) => {
  const { hash, pathname } = location;
  const isLoggedIn = !!getToken();
  if (isLoggedIn && checkExpireTime()) {
    clearStorages();
    location.reload();
    return null;
  }

  if (hash) {
    const { access_token, expires_in } = hash.split('&').reduce((acc, i) => {
      const [k, v] = i.replace('#','').split('=');
      return { ...acc, [k]: v };
    }, {});
    setToken(access_token);
    setExpireTime(parseInt(expires_in));
    location.href = '/main';
    return null;
  }

  if (!isLoggedIn && (pathname !== '/')) {
    location.href = '/';
    return null;
  }

  if (isLoggedIn && (pathname === '/')) {
    location.href = '/main';
    return null;
  }

  return (
    <Provider store={store}>
      <Router history={history}>
        <ErrorBoundary>
          <ContextProvider>
            <Switch>
              <Route component={pages.Main} exact path={['/main', '/main/:page']} />
              <Route component={pages.Login} exact path="/" />
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
