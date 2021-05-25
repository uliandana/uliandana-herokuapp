import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Context } from '../Main';
import styles from './styles.scoped.css';

export default function Stats() {
  const { term } = useContext(Context);
  const { data, isLoading } = useSelector(s => s.main);
  const popularities = data?.popularities?.[term];
  const features = data?.features?.[term];

  if (isLoading) {
    return <div />;
  }

  return (
    <section className={styles.root}>
      <Genres />
      <StatsDetail color="#2AA146" name={['Popularities', 'popular', 'popularity']} stats={popularities} />
      <StatsDetail color="#FF36A5" name={['Energies', 'energetic', 'energy']} stats={features?.energy} />
      <StatsDetail color="#6800BC" name={['Danceabilities', 'danceable', 'danceability']} stats={features?.danceability} />
      <Tempo />
    </section>
  );
}

export function Genres() {
  const { term } = useContext(Context);
  const { data } = useSelector(s => s.main);
  const items = data?.genres?.[term] || [];
  const colors = ['#001BEF', '#2AA146', '#F3BA24', '#FF36A5', '#6800BC'];
  return (
    <div className={styles.genres}>
      <h3>Top Genres</h3>
      <svg height="10rem" viewBox="0 0 20 20" width="10rem">
        <circle cx="10" cy="10" fill="#7CD4FF" r="10" />
        {colors?.map?.((i, idx) => (
          <circle cx="10" cy="10" fill="transparent" key={i} r="5" stroke={i}
            strokeDasharray={items?.[idx]?.strokeDasharray} strokeWidth="10" transform={items?.[idx]?.transform} />
        ))}
      </svg>
      <ul>
        {colors?.map?.((i, idx) => <li key={i} style={{ backgroundColor: i }}>{items?.[idx]?.total} {items?.[idx]?.name}</li>)}
        <li style={{ backgroundColor: '#7CD4FF' }}>others</li>
      </ul>
      <details>
        <summary>See Detail</summary>
        <ul>
          {items?.map?.(i => (
            <li key={i.name}>
              <header>{i.name}</header>
              <p>{i.artists?.join?.(' • ')}</p>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export function StatsDetail({ color, name, stats }) {
  const { term } = useContext(Context);
  const { data } = useSelector(s => s.main);
  return (
    <div className={styles.stats}>
      <h3>{name[0]}</h3>
      <strong style={{ backgroundColor: color }}>{Math.round(stats?.total / data?.tracks?.[term]?.length)}%</strong>
      <div>
        <header>Most {name[1]} ({stats?.highest?.[name[2]]}%)</header>
        <figure style={{ backgroundImage: `url(${stats?.highest?.album?.images?.[1]?.url})` }} />
        <h4>{stats?.highest?.name}</h4>
        <p>{stats?.highest?.artists?.[0]?.name}</p>
      </div>
      <div>
        <header>Least {name[1]} ({stats?.lowest?.[name[2]]}%)</header>
        <figure style={{ backgroundImage: `url(${stats?.lowest?.album?.images?.[1]?.url})` }} />
        <h4>{stats?.lowest?.name}</h4>
        <p>{stats?.lowest?.artists?.[0]?.name}</p>
      </div>
    </div>
  );
}

StatsDetail.defaultProps = {
  stats: {},
};

StatsDetail.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.array.isRequired,
  stats: PropTypes.object,
};


export function Tempo() {
  const { term } = useContext(Context);
  const { data } = useSelector(s => s.main);
  const stats = data?.features?.[term]?.tempo || { total: 0 };
  return (
    <div className={styles.stats}>
      <h3>Tempo</h3>
      <strong style={{ backgroundColor: '#F3BA24' }}>{Math.round(stats?.total / data?.tracks?.[term]?.length || 0)}</strong>
      <div>
        <header>Fastest ({Math.round(stats?.highest?.tempo)})</header>
        <figure style={{ backgroundImage: `url(${stats?.highest?.album?.images[1]?.url})` }} />
        <h4>{stats?.highest?.name}</h4>
        <p>{stats?.highest?.artists?.[0]?.name}</p>
      </div>
      <div>
        <header>Slowest ({Math.round(stats?.lowest?.tempo)})</header>
        <figure style={{ backgroundImage: `url(${stats?.lowest?.album?.images[1]?.url})` }} />
        <h4>{stats?.lowest?.name}</h4>
        <p>{stats?.lowest?.artists?.[0]?.name}</p>
      </div>
    </div>
  );
}
