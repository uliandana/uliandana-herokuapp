import React from 'react';
import styles from './styles.scoped.css';

export default function LazyFallback() {
  return (
    <div className={styles.root}>
      <div>
        <div className={styles.spinner} />
      </div>
    </div>
  );
}
