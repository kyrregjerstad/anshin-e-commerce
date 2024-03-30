import { generateRandomString, alphabet } from 'oslo/crypto';

type Params = {
  guest?: boolean;
};
export const generateId = ({ guest = false }: Params = {}) => {
  return guest
    ? 'guest-' + generateRandomString(26, alphabet('a-z', '0-9'))
    : generateRandomString(32, alphabet('a-z', '0-9'));
};

export const generateOrderId = () => {
  const randString = () => generateRandomString(4, alphabet('a-z', '0-9'));
  return `an-${randString()}-${randString()}-${randString()}`;
};

export const generateRefreshToken = ({ guest = false }: Params = {}) => {
  return guest
    ? 'guest-' + generateRandomString(58, alphabet('a-z', '0-9'))
    : generateRandomString(64, alphabet('a-z', '0-9'));
};
