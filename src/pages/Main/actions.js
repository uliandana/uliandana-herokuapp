import { getMe, getPersonalization } from '../../services';
import { FETCHED, LOADING } from './constants';

export function fetchData(type) {
  const key = type;
  const isProfile = type === 'profile';
  return async dispatch => {
    dispatch(loadingAction(true, key));
    try {
      const query = [
        '?time_range=short_term',
      ];
      const api = isProfile ? () => getMe() : () => getPersonalization(type, query.join('&'));
      const data = await api();
      dispatch(fetchedAction(isProfile ? data : data.items, key));
    } catch (err) {
      dispatch(loadingAction(false, key));
    }
  };
}

function fetchedAction(data, key) {
  return { type: FETCHED, data, key };
}

function loadingAction(isLoading, key) {
  return { type: LOADING, isLoading, key };
}
