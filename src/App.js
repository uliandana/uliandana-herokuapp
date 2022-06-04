import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/elements/ErrorBoundary';
import { Error404, Main, Login } from './pages';
import { checkExpireTime, clearStorages, getToken, setExpireTime, setToken } from './utils/storage';
import ContextProvider from './contexts';

if (!('scrollBehavior' in document.documentElement.style)) {
  import('scroll-behavior-polyfill');
}

const App = ({ store }) => {
  const { hash, pathname } = location;
  const isLoggedIn = !!getToken();
  if (isLoggedIn && checkExpireTime()) {
    clearStorages();
    location.reload();
    return null;
  }

  if (hash) {
    const { access_token, expires_in } = hash.split('&').reduce((acc, i) => {
      const [k, v] = i.replace('#', '').split('=');
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
      <BrowserRouter>
        <ErrorBoundary>
          <ContextProvider>
            <Routes>
              <Route element={<Main />} exact path="/main/:page" />
              <Route element={<Main />} exact path="/main" />
              <Route element={<Login />} exact path="/" />
              <Route element={<Error404 />} />
            </Routes>
          </ContextProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

export default hot(App);

App.propTypes = {
  store: PropTypes.object.isRequired,
};
