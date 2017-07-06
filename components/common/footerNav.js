import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base';
import strings from './local_strings.js'
import CameraComponent from '../views/CameraComponent';

 export default class FooterNav extends Component {
  render() {
    return (
      <Container>
        <Content />
        <Footer>
           <FooterTab>
            <Button vertical>
              <Icon name="home" />
            </Button>
            <Button vertical>
                <Icon name="book" />
            </Button>
            <Button   vertical>
              <Icon  name="map" />
            </Button>
            <Button vertical>
              <Icon name="person" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
