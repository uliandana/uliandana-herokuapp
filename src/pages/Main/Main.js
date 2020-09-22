import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

export default function Main() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(s => s.main);
  const { artists, tracks } = data;

  useEffect(() => {
    dispatch(fetchData('artists'));
    dispatch(fetchData('tracks'));
  }, []);

  const setContent = (t, v) => {
    const loading = [...Array.from({ length: 3 }).keys()].map(i => (
      <li key={i}>
        <span className="loading" />
        <span className="loading" />
      </li>
    ));
    return isLoading[t] ? loading : v;
  };

  return (
    <main className={styles.root}>
      <section>
        <ul>
          {setContent('tracks', tracks.map((i, idx) => (
            <li key={idx}>
              <small>{idx + 1}</small>
              <img alt={i.album.name} src={i.album.images[1].url} />
              <h4>{i.name}</h4>
              <p>{i.artists[0].name}</p>
            </li>
          )))}
        </ul>
      </section>
      <section>
        <ul>
          {setContent('artists', artists.map((i, idx) => (
            <li key={idx}>
              <small>{idx + 1}</small>
              <img alt={i.name} src={i.images[1].url} />
              <h4>{i.name}</h4>
            </li>
          )))}
        </ul>
      </section>
    </main>
  );
}
