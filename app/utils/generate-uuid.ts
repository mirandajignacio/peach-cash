import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const generateUUID = (): string => {
  return uuidv4();
};

export { generateUUID };
