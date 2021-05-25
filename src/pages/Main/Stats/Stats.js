import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Stats() {
  const { term } = useContext(Context);
  const { data } = useSelector(s => s.main);
  const items = data?.genres?.[term] || [];
  const colors = ['#001BEF', '#2AA146', '#F3BA24', '#FF36A5', '#6800BC'];

  return (
    <section className={styles.root}>
      <div className={styles.genres}>
        <h3>Top Genres</h3>
        <svg height="10rem" viewBox="0 0 20 20" width="10rem">
          <circle cx="10" cy="10" fill="#7CD4FF" r="10" />
          {colors?.map?.((i, idx) => (
            <circle cx="10" cy="10" fill="transparent" key={i} r="5"
              stroke={i}
              strokeDasharray={items?.[idx]?.strokeDasharray}
              strokeWidth="10"
              transform={items?.[idx]?.transform} />
          ))}
        </svg>
        <ul>
          {colors?.map?.((i, idx) => (
            <li key={i} style={{ backgroundColor: i }}>{items?.[idx]?.total} {items?.[idx]?.name}</li>
          ))}
          <li style={{ backgroundColor: '#7CD4FF' }}>others</li>
        </ul>
        <details>
          <summary>See Detail</summary>
          <ul>
            {items?.map?.(i => (
              <li key={i.name}>
                <header>{i.name}</header>
                <p>{i.artists?.join?.(' • ')}</p>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
