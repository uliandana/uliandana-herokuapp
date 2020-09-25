import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scoped.css';

export default function ProgressLoading(props) {
  const { isLoading } = props;
  const [loader, setLoader] = useState({ display: 'none', width: 0 });

  useEffect(() => {
    const { display, width } = loader;
    if (!isLoading && (width === '100vw')) {
      setTimeout(() => {
        setLoader({
          display: 'none',
          width: 0,
        });
      }, 1100);
    } else if (isLoading && (width === 0)) {
      if (display === 'none') {
        setLoader({
          ...loader,
          display: 'block',
        });
      } else {
        setLoader({
          ...loader,
          transition: 'width 2s ease-in-out',
          width: '75vw',
        });
      }
    } else if (!isLoading && (width === '75vw')) {
      setLoader({
        display: 'block',
        transition: 'width 1s ease-in-out',
        width: '100vw',
      });
    }
  }, [isLoading, loader]);

  return (
    <div className={styles.root} style={{ display: loader.display }}>
      <span style={{ transition: loader.transition, width: loader.width }} />
    </div>
  );
}

ProgressLoading.defaultProps = {
  isLoading: false,
};

ProgressLoading.propTypes = {
  isLoading: PropTypes.bool,
};
