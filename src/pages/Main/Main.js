import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ProgressLoading from '../../components/elements/ProgressLoading';
import Spinner from '../../components/elements/Spinner';
import { clearStorages } from '../../utils/storage';
import Artists from './Artists';
import Profile from './Profile';
import Stats from './Stats';
import Tracks from './Tracks';
import { fetchData, fetchProfile } from './actions';
import styles from './styles.scoped.css';

export const Context = createContext({});

export default function Main() {
  const dispatch = useDispatch();
  const { page } = useParams();
  const { data, isLoading, isMounting } = useSelector(s => s.main);
  const [nav, setNav] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [term, setTerm] = useState('short_term');

  const onLogout = e => {
    e.preventDefault();
    clearStorages();
    location.href = '/';
  };

  useEffect(() => {
    (!data?.artists?.[term]?.length) && dispatch(fetchData('artists', term, true));
    (!data?.tracks?.[term]?.length) && dispatch(fetchData('tracks', term, true));
    (!data?.profile?.display_name) && dispatch(fetchProfile());
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
        {(p => {
          switch(p) {
            case 'tracks':
              return <Tracks />;
            case 'stats':
              return <Stats />;
            default:
              return <Artists />;
          }
        })(page)}
        <nav className={(overlay && nav) ? '' : styles.hidden}>
          <Link to="/main/">Artists</Link>
          <Link to="/main/tracks">Tracks</Link>
          <Link to="/main/stats">Stats</Link>
          <Link onClick={onLogout} to="/">Log Out</Link>
        </nav>
        <button className={overlay ? '' : styles.hidden} onClick={() => setNav(!nav)}>☰</button>
      </main>
      <ProgressLoading isLoading={isLoading} />
    </Context.Provider>
  );
}
