import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import SimpleNavigationApp from './androidSrc/SimpleNavigationApp'

export default class LoriTimesheetsApp extends Component {
  render() {
    return (
        <SimpleNavigationApp/>
    );
  }
}

AppRegistry.registerComponent('LoriTimesheetsApp', () => LoriTimesheetsApp);
