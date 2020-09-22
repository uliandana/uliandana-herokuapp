import { getPersonalization } from '../../services';
import { FETCHED, LOADING } from './constants';

export function fetchData(type) {
  const key = type;
  return async dispatch => {
    dispatch(loadingAction(true, key));
    try {
      const query = [
        '?time_range=short_term',
      ];
      const { items } = await getPersonalization(type, query.join('&'));
      dispatch(fetchedAction(items, key));
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
