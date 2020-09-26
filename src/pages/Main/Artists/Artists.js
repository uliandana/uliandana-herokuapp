import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useFlash } from '../hooks';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Artists() {
  const { term } = useContext(Context);
  const { goBack } = useHistory();
  const { page } = useParams();
  const [txtTerm, setTxtTerm] = useState(term);
  const { data, isMounting } = useSelector(s => s.main);
  const items = useFlash(data.artists);
  const isArtistsPage = page === 'artists';

  useEffect(() => {
    setTxtTerm(term);
  }, [items]);

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
    <section className={styles.root}>
      <header>
        <h3>Your top artists {txtTerm}</h3>
        {isArtistsPage
          ? <button onClick={goBack}>&times;</button>
          : <Link to="/main/artists">More &rarr;</Link>}
      </header>
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
