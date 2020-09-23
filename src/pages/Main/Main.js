import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/elements/Spinner';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

const Context = createContext({});

export default function Main() {
  const dispatch = useDispatch();
  const [term, setTerm] = useState('short_term');
  const { data, isLoading } = useSelector(s => s.main);
  const { profile } = data;

  useEffect(() => {
    dispatch(fetchData('artists', term));
    dispatch(fetchData('tracks', term));
    dispatch(fetchData('profile'));
  }, []);

  useEffect(() => {
    dispatch(fetchData('artists', term));
    dispatch(fetchData('tracks', term));
  }, [term]);

  if (isLoading.profile) {
    return (
      <main className={styles.spinner}>
        <Spinner size="10rem" />
      </main>
    );
  }

  const btns = [
    { text: 'Last Month', term: 'short_term' },
    { text: 'Last 6 Months', term: 'medium_term' },
    { text: 'All Time', term: 'long_term' },
  ];

  const contextValue = {
    term: btns.find(i => i.term === term).text.toLowerCase(),
  };

  return (
    <Context.Provider value={contextValue}>
      <main className={styles.root}>
        <header>
          <h1>Welcome, {profile?.display_name}!</h1>
          <nav>
            {btns.map(i => (
              <button key={i.term} onClick={() => setTerm(i.term)}>{i.text}</button>
            ))}
          </nav>
        </header>
        <Profile />
        <Artists />
        <Tracks />
      </main>
    </Context.Provider>
  );
}

export function Profile() {
  const { profile } = useSelector(s => s.main).data;
  return (
    <section className={styles.profile}>
      <figure style={{ backgroundImage: `url(${profile?.images[0]?.url})` }} />
      <h4>{profile?.display_name}</h4>
      <p>{profile?.followers?.total} followers</p>
    </section>
  );
}

export function Artists() {
  const { term } = useContext(Context);
  const { data, isLoading } = useSelector(s => s.main);
  const { artists } = data;

  const setContent = v => {
    const loading = [...Array.from({ length: 3 }).keys()].map(i => (
      <li key={i}>
        <span className="loading" />
        <span className="loading" />
      </li>
    ));
    return isLoading.artists ? loading : v;
  };

  return (
    <section className={styles.artists}>
      <h3>Your top artists {term}</h3>
      <ul>
        {setContent(artists.map((i, idx) => (
          <li key={idx}>
            <small>{idx + 1}</small>
            <img alt={i.name} src={i.images[1].url} />
            <h4>{i.name}</h4>
          </li>
        )))}
      </ul>
    </section>
  );
}

export function Tracks() {
  const { term } = useContext(Context);
  const { data, isLoading } = useSelector(s => s.main);
  const { tracks } = data;

  const setContent = v => {
    const loading = [...Array.from({ length: 3 }).keys()].map(i => (
      <li key={i}>
        <span className="loading" />
        <span className="loading" />
      </li>
    ));
    return isLoading.tracks ? loading : v;
  };

  return (
    <section className={styles.tracks}>
      <h3>Your top tracks {term}</h3>
      <ul>
        {setContent(tracks.map((i, idx) => (
          <li key={idx}>
            <small>{idx + 1}</small>
            <img alt={i.album.name} src={i.album.images[1].url} />
            <h4>{i.name}</h4>
            <p>{i.artists[0].name}</p>
          </li>
        )))}
      </ul>
    </section>
  );
}
