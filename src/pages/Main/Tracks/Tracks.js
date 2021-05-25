import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Tracks() {
  const { btns, term } = useContext(Context);
  const { data, isLoading } = useSelector(s => s.main);
  const items = data?.tracks?.[term] || [];

  const setContent = v => {
    if (isLoading) {
      return [...Array.from({ length: 3 }).keys()].map(i => (
        <li key={i}>
          <span className="loading" />
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
        <h3>{data?.profile?.display_name}'s top tracks {btns.find(i => i.term === term).text.toLowerCase()}</h3>
      </header>
      <ul>
        {setContent(items.map((i, idx) => (
          <li key={idx} title={i.name}>
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
