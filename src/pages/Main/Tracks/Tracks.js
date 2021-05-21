import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Tracks() {
  const { btns, term } = useContext(Context);
  const { data, isMounting } = useSelector(s => s.main);
  const items = data?.tracks?.[term] || [];

  const setContent = v => {
    if (isMounting.tracks) {
      return [...Array.from({ length: 3 }).keys()].map(i => (
        <li key={i}>
          <span className="loading" />
          <span className="loading" />
        </li>
      ));
    }
    return v;
  };

  return (
    <section className={styles.root}>
      <header>
        <h3>Your top tracks {btns.find(i => i.term === term).text.toLowerCase()}</h3>
      </header>
      <ul>
        {setContent(items.map((i, idx) => (
          <li key={idx}>
            <small>{idx + 1}</small>
            <figure style={{ backgroundImage: `url(${i.album?.images[1]?.url})` }} />
            <h4>{i.name}</h4>
            <p>{i.artists[0]?.name}</p>
          </li>
        )))}
      </ul>
    </section>
  );
}
