import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Profile() {
  const { btns, setTerm, term, overlay } = useContext(Context);
  const { profile } = useSelector(s => s.main).data;
  return (
    <section className={[styles.root, !overlay && styles.hidden].filter(Boolean).join(' ')}>
      <figure style={{ backgroundImage: `url(${profile?.images[0]?.url})` }} />
      <p>{profile?.display_name} • {profile?.followers?.total} followers</p>
      <select onChange={e => setTerm(e.target.value)} value={term}>
        {btns.map(i => <option key={i.term} value={i.term}>{i.text}</option>)}
      </select>
    </section>
  );
}
