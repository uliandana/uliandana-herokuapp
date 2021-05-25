import { PROFILE_FETCHED, TERM_FETCHED, LOADING, MOUNTING } from './constants';

const initialState = {
  isLoading: false,
  isMounting: {
    artists: true,
    profile: true,
    tracks: true,
  },
  data: {
    artists: {},
    profile: {},
    genres: [],
    tracks: {},
  },
};

export default function reducer(state = initialState, action = {}) {
  const { type, data, isLoading, isMounting, key, term } = action;

  switch (type) {
    case PROFILE_FETCHED:
      return {
        ...state,
        isLoading: false,
        isMounting: { ...state.isMounting, profile: false },
        data: { ...state.data, profile: data },
      };
    case TERM_FETCHED:
      return {
        ...state,
        isLoading: false,
        isMounting: { ...state.isMounting, [key]: false },
        data: {
          ...state.data,
          [key]: { ...state.data[key], [term]: data },
        },
      };
    case LOADING:
      return {
        ...state,
        isLoading,
      };
    case MOUNTING:
      return {
        ...state,
        isMounting: { ...state.isMounting, [key]: isMounting },
      };
    default:
      return state;
  }
}
