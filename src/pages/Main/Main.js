import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/elements/Spinner';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

export default function Main() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(s => s.main);
  const { artists, profile, tracks } = data;

  useEffect(() => {
    dispatch(fetchData('artists'));
    dispatch(fetchData('tracks'));
    dispatch(fetchData('profile'));
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

  if (isLoading.profile) {
    return (
      <main className={styles.spinner}>
        <Spinner size="10rem" />
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <h1>Welcome, {profile?.display_name}!</h1>
      <section className={styles.profile}>
        <figure style={{ backgroundImage: `url(${profile?.images[0]?.url})` }} />
        <h4>{profile?.display_name}</h4>
        <p>{profile?.followers?.total} followers</p>
      </section>
      <section className={styles.artists}>
        <h3>Your top artists this month</h3>
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
      <section className={styles.tracks}>
        <h3>Your top tracks this month</h3>
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
    </main>
  );
}
