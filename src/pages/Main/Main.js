import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/elements/Spinner';
import Artists from './Artists';
import Profile from './Profile';
import Tracks from './Tracks';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

export const Context = createContext({});

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
