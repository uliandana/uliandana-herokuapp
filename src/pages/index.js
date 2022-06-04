import React, { lazy, Suspense } from 'react';
import LazyFallback from '../components/elements/LazyFallback';

const Suspensed = (Element) => function suspense(props) {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Element {...props} />
    </Suspense>
  );
};

export const Error404 = Suspensed(lazy(() => import('./Error404')));
export const Main = Suspensed(lazy(() => import('./Main')));
export const Login = Suspensed(lazy(() => import('./Login')));
