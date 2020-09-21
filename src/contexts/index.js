import React from 'react';
import PropTypes from 'prop-types';
import AppContextProvider, { AppContext } from './app';

export { AppContext };
export default function ContextProvider({ children }) {
  return (
    <AppContextProvider>
      {children}
    </AppContextProvider>
  );
}

ContextProvider.defaultProps = {
  children: null,
};

ContextProvider.propTypes = {
  children: PropTypes.node,
};
