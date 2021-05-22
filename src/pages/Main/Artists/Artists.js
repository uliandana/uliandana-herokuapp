import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Artists() {
  const { btns, term, overlay, setOverlay } = useContext(Context);
  const { data } = useSelector(s => s.main);
  const items = data?.artists?.[term] || [];

  return (
    <section className={styles.root}>
      <header className={overlay ? '' : styles.hidden} onClick={() => setOverlay(false)}>
        <h3>{data?.profile?.display_name}'s top artists {btns.find(i => i.term === term).text.toLowerCase()}</h3>
      </header>
      <ul onClick={() => setOverlay(true)}>
        {items.map((i, idx) => (
          <li key={idx} style={{ backgroundImage: `url(${i.images[1]?.url})` }}>
            <small>{idx + 1}</small>
            <h4>{i.name}</h4>
          </li>
        ))}
      </ul>
    </section>
  );
}
