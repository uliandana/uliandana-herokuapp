import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressLoading from '../../components/elements/ProgressLoading';
import Spinner from '../../components/elements/Spinner';
import Artists from './Artists';
import Profile from './Profile';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

export const Context = createContext({});

export default function Main() {
  const dispatch = useDispatch();
  const { data, isLoading, isMounting } = useSelector(s => s.main);
  const [nav, setNav] = useState(true);
  const [overlay, setOverlay] = useState(true);
  const [term, setTerm] = useState('short_term');

  useEffect(() => {
    (!data?.artists?.[term]?.length) && dispatch(fetchData('artists', term, true));
    (!data?.tracks?.[term]?.length) && dispatch(fetchData('tracks', term, true));
    (!data?.profile?.display_name) && dispatch(fetchData('profile'));
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
    btns,
    term, setTerm,
    overlay, setOverlay,
  };

  return (
    <Context.Provider value={contextValue}>
      <main className={styles.root}>
        <Profile />
        <Artists />
        <nav className={(overlay && nav) ? '' : styles.hidden}>
          <Link to="/">Artists</Link>
          <Link to="/tracks">Tracks</Link>
          <Link to="/stats">Stats</Link>
        </nav>
        <button className={overlay ? '' : styles.hidden} onClick={() => setNav(!nav)}>☰</button>
      </main>
      <ProgressLoading isLoading={isLoading} />
    </Context.Provider>
  );
}
