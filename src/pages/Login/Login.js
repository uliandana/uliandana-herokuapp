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
    </main>
  );
}
