import { dev } from './dev';
import { prod } from './prod';

const ENV = __DEV__ ? dev : prod;

export default ENV;
