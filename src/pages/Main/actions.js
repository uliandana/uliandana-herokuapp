import { getMe, getPersonalization } from '../../services';
import { PROFILE_FETCHED, TERM_FETCHED, LOADING, MOUNTING } from './constants';

export function fetchData(type, term, hasMounted) {
  const key = type;
  const isProfile = type === 'profile';
  const loadAction = hasMounted ? loadingAction : mountingAction;

  return async dispatch => {
    dispatch(loadAction(true, key));
    try {
      const query = [
        `?time_range=${term}&limit=24`,
      ];
      const api = isProfile ? () => getMe() : () => getPersonalization(type, query.join('&'));
      const data = await api();
      dispatch(isProfile ? profileFetchedAction(data) : termFetchedAction(data?.items, key, term));
    } catch (err) {
      dispatch(loadAction(false, key));
    }
  };
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
