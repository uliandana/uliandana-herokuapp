import React from 'react';
import styles from './styles.scoped.css';

export default function Login() {
  const query = [
    '?client_id=164122939ecf49c8bca2b87dab25b9d3',
    'response_type=token',
    `redirect_uri=${location.origin}/main`,
    'scope=user-read-private user-read-email user-top-read',
  ].join('&');
  return (
    <main className={styles.root}>
      <section>
        <div>
          <figure style={{ backgroundImage: 'url(/assets/banner-1.jpeg)' }} />
          <figure style={{ backgroundImage: 'url(/assets/banner-2.jpeg)' }} />
          <figure style={{ backgroundImage: 'url(/assets/banner-3.jpeg)' }} />
        </div>
        <h1>Enter</h1>
        <a href={`https://accounts.spotify.com/authorize${query}`}>Login with spotify</a>
      </section>
      <footer>
        <p>Find me on:&nbsp;</p>
        <nav>
          <a href="https://twitter.com/uliandana"><img alt="uliandana" src="/assets/twitter.svg" /></a>
          <a href="https://www.instagram.com/okakola/"><img alt="okakola" src="/assets/instagram.svg" /></a>
          <a href="https://open.spotify.com/user/oka.uliandana"><img alt="oka.uliandana" src="/assets/spotify.svg" /></a>
        </nav>
      </footer>
    </main>
  );
}
