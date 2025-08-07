/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
<<<<<<< HEAD
import {TextEncoder} from 'text-encoding';

global.TextEncoder = TextEncoder;
=======

>>>>>>> cd3ee9b74a7876b405f0ce3ddd06b2b72c561dab
AppRegistry.registerComponent(appName, () => App);
