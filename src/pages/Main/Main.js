import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/elements/Spinner';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

const Context = createContext({});

export default function Main() {
  const dispatch = useDispatch();
  const [term, setTerm] = useState('short_term');
  const { data, isMounting } = useSelector(s => s.main);
  const { profile } = data;

  useEffect(() => {
    dispatch(fetchData('artists', term));
    dispatch(fetchData('tracks', term));
    dispatch(fetchData('profile'));
  }, []);

  useEffect(() => {
    dispatch(fetchData('artists', term, true));
    dispatch(fetchData('tracks', term, true));
  }, [term]);

  if (isMounting.profile) {
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
              <button disabled={i.term === term} key={i.term} onClick={() => setTerm(i.term)}>{i.text}</button>
            ))}
          </nav>
        </header>
        <Profile />
        <Artists />
        <Tracks />
      </main>
      <Progress />
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
  const { data, isMounting } = useSelector(s => s.main);
  const items = useFlash(data.artists);

  const setContent = v => {
    if (isMounting.artists) {
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
    <section className={styles.artists}>
      <h3>Your top artists {term}</h3>
      <ul>
        {setContent(items.map((i, idx) => (
          <li key={idx}>
            <small>{idx + 1}</small>
            <figure style={{ backgroundImage: `url(${i.images[1].url})` }} />
            <h4>{i.name}</h4>
          </li>
        )))}
      </ul>
    </section>
  );
}

export function Tracks() {
  const { term } = useContext(Context);
  const { data, isMounting } = useSelector(s => s.main);
  const items = useFlash(data.tracks);

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
    <section className={styles.tracks}>
      <h3>Your top tracks {term}</h3>
      <ul>
        {setContent(items.map((i, idx) => (
          <li key={idx}>
            <small>{idx + 1}</small>
            <figure style={{ backgroundImage: `url(${i.album.images[1].url})` }} />
            <h4>{i.name}</h4>
            <p>{i.artists[0].name}</p>
          </li>
        )))}
      </ul>
    </section>
  );
}

export function Progress() {
  const { isLoading } = useSelector(s => s.main);
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
    <div style={{ display: loader.display }}>
      <span style={{ transition: loader.transition, width: loader.width }} />
    </div>
  );
}

export function useFlash(data) {
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems([]);
  }, [data]);

  useEffect(() => {
    (!items.length && data.length) && setItems(data);
  }, [items]);

  return items;
}
