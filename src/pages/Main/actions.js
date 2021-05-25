import { getAudioFeatures, getMe, getPersonalization } from '../../services';
import { PROFILE_FETCHED, TERM_FETCHED, LOADING, MOUNTING } from './constants';

export function fetchProfile() {
  const key = 'profile';
  const loadAction = mountingAction;
  return async dispatch => {
    dispatch(loadAction(true, key));
    try {
      const data = await getMe();
      dispatch(profileFetchedAction(data));
    } catch (err) {
      dispatch(loadAction(false, key));
    }
  };
}

export function fetchData(key, term, hasMounted) {
  const loadAction = hasMounted ? loadingAction : mountingAction;
  return async dispatch => {
    dispatch(loadAction(true, key));
    try {
      const query = [
        `?time_range=${term}&limit=24`,
      ];
      const data = await getPersonalization(key, query.join('&'));
      const items = data?.items;
      dispatch(termFetchedAction(items, key, term));
      (key === 'artists') && dispatch(termFetchedAction(mapGenreStats(items), 'genres', term));
      if (key === 'tracks') {
        dispatch(termFetchedAction(mapPopularities(items), 'popularities', term));
        const { audio_features } = await getAudioFeatures(`?ids=${items?.map(i => i.id).join(',')}`);
        dispatch(termFetchedAction(mapFeatures(audio_features, items), 'features', term));
      }
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

function mapPopularities(data) {
  if (!data) {
    return {};
  }

  return data.reduce((acc, i) => {
    const lowest = acc.lowest.popularity < i.popularity ? acc.lowest : i;
    const highest = acc.highest.popularity > i.popularity ? acc.highest : i;
    const total = acc.total + i.popularity;
    return { total, lowest, highest };
  }, { lowest: data[0], highest: data[0], total: 0 });
}

function mapFeatures(data, trackData) {
  if (!data) {
    return {};
  }

  const initial = { lowest: data[0], highest: data[0], total: 0 };

  const mapped = data.reduce((acc, i) => {
    ['energy', 'danceability', 'tempo'].forEach(j => {
      acc[j] = {
        lowest: acc[j].lowest[j] < i[j] ? acc[j].lowest : i,
        highest: acc[j].highest[j] > i[j] ? acc[j].highest : i,
        total: acc[j].total + i[j],
      };
    });
    return acc;
  }, { energy: initial, danceability: initial, tempo: initial });

  mapped.energy.lowest = { ...trackData.find(i => i.id === mapped.energy.lowest.id), energy: Math.round(mapped.energy.lowest.energy * 100) };
  mapped.energy.highest = { ...trackData.find(i => i.id === mapped.energy.highest.id), energy: Math.round(mapped.energy.highest.energy * 100) };
  mapped.energy.total = Math.round(mapped.energy.total * 100);
  mapped.danceability.lowest = { ...trackData.find(i => i.id === mapped.danceability.lowest.id), danceability: Math.round(mapped.danceability.lowest.danceability * 100) };
  mapped.danceability.highest = { ...trackData.find(i => i.id === mapped.danceability.highest.id), danceability: Math.round(mapped.danceability.highest.danceability * 100) };
  mapped.danceability.total = Math.round(mapped.danceability.total * 100);
  mapped.tempo.lowest = { ...trackData.find(i => i.id === mapped.tempo.lowest.id), tempo: mapped.tempo.lowest.tempo };
  mapped.tempo.highest = { ...trackData.find(i => i.id === mapped.tempo.highest.id), tempo: mapped.tempo.highest.tempo };
  return mapped;
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
