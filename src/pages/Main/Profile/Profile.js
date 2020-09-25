import React from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.scoped.css';

export default function Profile() {
  const { profile } = useSelector(s => s.main).data;
  return (
    <section className={styles.root}>
      <figure style={{ backgroundImage: `url(${profile?.images[0]?.url})` }} />
      <h4>{profile?.display_name}</h4>
      <p>{profile?.followers?.total} followers</p>
    </section>
  );
}
