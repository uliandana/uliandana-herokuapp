import { getMe, getPersonalization } from '../../services';
import { PROFILE_FETCHED, TERM_FETCHED, LOADING, MOUNTING } from './constants';

export function fetchData(key, term, hasMounted) {
  const isProfile = key === 'profile';
  const loadAction = hasMounted ? loadingAction : mountingAction;

  return async dispatch => {
    dispatch(loadAction(true, key));
    try {
      const query = [
        `?time_range=${term}&limit=24`,
      ];
      const api = isProfile ? () => getMe() : () => getPersonalization(key, query.join('&'));
      const data = await api();
      dispatch(isProfile ? profileFetchedAction(data) : termFetchedAction(data?.items, key, term));
      (key === 'artists') && dispatch(termFetchedAction(mapGenreStats(data?.items), 'genres', term));
    } catch (err) {
      dispatch(loadAction(false, key));
    }
  };
}

function sort (a, b) {
  if (a.total < b.total) {
    return 1;
  }
  if (a.total > b.total) {
    return -1;
  }
  return 0;
}

function mapGenreStats(data) {
  if (!data) {
    return [];
  }

  const items = data.reduce((acc, i) => {
    i?.genres?.forEach?.(j => {
      const idx = acc.findIndex(k => k.name === j);
      if (idx === -1) {
        acc.push({ name: j, total: 1, artists: [i.name], });
      } else {
        acc[idx].total = acc[idx].total + 1;
        acc[idx].artists.push(i.name);
      }
    });
    return acc;
  }, []).sort(sort);

  const total = items.reduce((acc, i) => acc + i.total, 0);

  return items.reduce((acc, i, idx) => {
    const ratio = i.total / total;
    acc.items[idx].strokeDasharray = `${ratio * 31.4} 31.4`;
    acc.items[idx].transform = `rotate(${acc.degree - 90}, 10, 10)`;
    acc.degree = acc.degree + (ratio * 360);
    return acc;
  }, { items, degree: 0 }).items;
}

function profileFetchedAction(data) {
  return { type: PROFILE_FETCHED, data };
}

function termFetchedAction(data, key, term) {
  return { type: TERM_FETCHED, data, key, term };
}

function loadingAction(isLoading) {
  return { type: LOADING, isLoading };
}

function mountingAction(isMounting, key) {
  return { type: MOUNTING, isMounting, key };
}
