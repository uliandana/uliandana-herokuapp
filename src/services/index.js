import fetch, { BEARER_AUTH } from '../utils/fetch';

const BASE_URL = process.env.API_URL;

export const getMe = async () => (
  fetch(`${BASE_URL}/v1/me`, 'get', { headers: BEARER_AUTH })
);

export const getPersonalization = async (type, query) => (
  fetch(`${BASE_URL}/v1/me/top/${type}${query}`, 'get', { headers: BEARER_AUTH })
);
