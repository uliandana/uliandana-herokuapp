import { FETCHED, LOADING } from './constants';

const initialState = {
  isLoading: {
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
  const { type, data, isLoading, key } = action;

  switch (type) {
    case FETCHED:
      return {
        ...state,
        isLoading: { ...state.isLoading, [key]: false },
        data: { ...state.data, [key]: data },
      };
    case LOADING:
      return {
        ...state,
        isLoading: { ...state.isLoading, [key]: isLoading },
      };
    default:
      return state;
  }
}
