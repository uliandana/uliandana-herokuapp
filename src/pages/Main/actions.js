import { getMe, getPersonalization } from '../../services';
import { FETCHED, LOADING, MOUNTING } from './constants';

export function fetchData(type, term, hasMounted) {
  const key = type;
  const isProfile = type === 'profile';
  const loadAction = hasMounted ? loadingAction : mountingAction;

  return async dispatch => {
    dispatch(loadAction(true, key));
    try {
      const query = [
        `?time_range=${term}`,
      ];
      const api = isProfile ? () => getMe() : () => getPersonalization(type, query.join('&'));
      const data = await api();
      dispatch(fetchedAction(isProfile ? data : data.items, key));
    } catch (err) {
      dispatch(loadAction(false, key));
    }
  };
}

function fetchedAction(data, key) {
  return { type: FETCHED, data, key };
}

function loadingAction(isLoading) {
  return { type: LOADING, isLoading };
}

function mountingAction(isMounting, key) {
  return { type: MOUNTING, isMounting, key };
}
