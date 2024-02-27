import { generateRandomString, alphabet } from 'oslo/crypto';

type Params = {
  guest?: boolean;
};
export const generateId = ({ guest = false }: Params = {}) => {
  return guest
    ? 'guest-' + generateRandomString(26, alphabet('a-z', '0-9'))
    : generateRandomString(32, alphabet('a-z', '0-9'));
};
