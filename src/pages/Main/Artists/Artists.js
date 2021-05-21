import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Context } from '../Main';
import styles from './styles.scoped.css';

const SubContext = createContext({});

export default function Artists() {
  const { btns, term } = useContext(Context);
  const { goBack } = useHistory();
  const { page } = useParams();
  const [Content, setContent] = useState(null);
  const { data, isMounting } = useSelector(s => s.main);
  const items = data?.artists?.[term] || [];
  const isArtistsPage = page === 'artists';

  useEffect(() => {
    setContent(null);
    const t = setTimeout(() => {
      if (isArtistsPage) {
        setContent(<Generate />);
      } else {
        setContent(
          <ul>
            {isMounting.artists ? <Mounting /> : <List />}
          </ul>
        );
      }
    }, 500);
    return () => clearTimeout(t);
  }, [page, isMounting.artists]);

  return (
    <SubContext.Provider value={{ items }}>
      <section className={styles.root}>
        <header>
          <h3>Your top artists {btns.find(i => i.term === term).text.toLowerCase()}</h3>
          {isArtistsPage
            ? <button onClick={goBack}>&times;</button>
            : <Link to="/main/artists">&rarr;</Link>}
        </header>
        {Content}
      </section>
    </SubContext.Provider>
  );
}

export function Mounting() {
  return [...Array.from({ length: 3 }).keys()].map(i => (
    <li key={i}>
      <span className="loading" />
      <span className="loading" />
    </li>
  ));
}

export function Generate() {
  const { items } = useContext(SubContext);
  const [dimension, setDimension] = useState([]);
  const [open, setOpen] = useState(false);
  const [ratio, setRatio] = useState(false);
  const ref = useRef(null);
  const [height, width] = dimension;


  useEffect(() => {
    const { clientHeight, clientWidth } = ref.current;
    const { screen } = window;
    const isDesktop = screen.height < screen.width;
    const r = isDesktop ? clientHeight / 2436 : clientWidth / screen.width;
    setRatio(r);
    setDimension(isDesktop ? [clientHeight, r * 1125] : [screen.height * r, clientWidth]);

    const base = document.querySelector('#app > main > section:nth-child(3)');
    if (!isDesktop) {
      const plus = (screen.height * r - clientHeight);
      base.style.height = `${base.clientHeight + plus}px`;
    }
    return () => {
      base.removeAttribute('style');
    };
  }, [open]);

  const figStyle = (i, idx) => {
    const ctrSize = 0.3 * width;
    const [ct, cl] = [0.5 * height, 0.5 * width];
    const gap = 0.05 * width;
    const size = idx ? (0.2 * width) : ctrSize;
    const [hf, hfc] = [0.5 * size, 0.5 * ctrSize];
    const dg = (Math.sqrt(2) / 2) * (hfc + gap + hf);
    const pos = [
      {
        left : `${cl - hf}px`,
        top: `${ct - hf}px`,
      },
      {
        left : `${cl - size - gap - hfc}px`,
        top: `${ct - hf}px`,
      },
      {
        left : `${cl - dg - hf}px`,
        top: `${ct - dg - hf}px`,
      },
      {
        left : `${cl - hf}px`,
        top: `${ct - size - gap - hfc}px`,
      },
      {
        left : `${cl + dg - hf}px`,
        top: `${ct - dg - hf}px`,
      },
      {
        left : `${cl + gap + hfc}px`,
        top: `${ct - hf}px`,
      },
      {
        left : `${cl + dg - hf}px`,
        top: `${ct + dg - hf}px`,
      },
      {
        left : `${cl - hf}px`,
        top: `${ct + gap + hfc}px`,
      },
      {
        left : `${cl - dg - hf}px`,
        top: `${ct + dg - hf}px`,
      },
    ];
    return {
      backgroundImage: `url(${i.images[1]?.url})`,
      height: `${size}px`,
      width: `${size}px`,
      ...(pos[idx] || { display: 'none' }),
    };
  };

  const style = {
    height: `${height}px`,
    width: `${width}px`,
  };

  const onClick = () => {
    ref.current.style.transform = `scale(${open ? 1 : 1/ratio})`;
    window.scrollTo(0, 0);
    setOpen(!open);
  };

  return (
    <div className={open ? styles.fig : ''} onClick={onClick} ref={ref} style={style}>
      {items.map((i, idx) => (
        <figure key={idx} style={figStyle(i, idx)} />
      ))}
    </div>
  );
}

export function List() {
  const { items } = useContext(SubContext);
  return items.map((i, idx) => (
    <li key={idx}>
      <small>{idx + 1}</small>
      <figure style={{ backgroundImage: `url(${i.images[1]?.url})` }} />
      <h4>{i.name}</h4>
    </li>
  ));
}
