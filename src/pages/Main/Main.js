import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressLoading from '../../components/elements/ProgressLoading';
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
  const { data, isLoading, isMounting } = useSelector(s => s.main);
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
      <ProgressLoading isLoading={isLoading} />
    </Context.Provider>
  );
}
