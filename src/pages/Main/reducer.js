import { FETCHED, LOADING, MOUNTING } from './constants';

const initialState = {
  isLoading: false,
  isMounting: {
    artists: true,
    profile: true,
    tracks: true,
  },
  data: {
    artists: [],
    profile: {},
    tracks: [],
  },
};

export default function reducer(state = initialState, action = {}) {
  const { type, data, isLoading, isMounting, key } = action;

  switch (type) {
    case FETCHED:
      return {
        ...state,
        isLoading: false,
        isMounting: { ...state.isMounting, [key]: false },
        data: { ...state.data, [key]: data },
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
