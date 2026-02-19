/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {TextEncoder} from 'text-encoding';

global.TextEncoder = TextEncoder;
AppRegistry.registerComponent(appName, () => App);
