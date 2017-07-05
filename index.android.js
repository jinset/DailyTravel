/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import Login from './components/views/login';
import Signup from './components/views/signup';

AppRegistry.registerComponent('DailyTravel', () => Login);
