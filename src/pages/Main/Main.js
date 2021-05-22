import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressLoading from '../../components/elements/ProgressLoading';
import Spinner from '../../components/elements/Spinner';
import Artists from './Artists';
import Profile from './Profile';
import { fetchData } from './actions';
import styles from './styles.scoped.css';

export const Context = createContext({});

export default function Main() {
  const dispatch = useDispatch();
  const [term, setTerm] = useState('short_term');
  const { data, isLoading, isMounting } = useSelector(s => s.main);
  const [overlay, setOverlay] = useState(true);

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
      </main>
      <ProgressLoading isLoading={isLoading} />
    </Context.Provider>
  );
}
