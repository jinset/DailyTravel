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
              <Text>{strings.home}</Text>
            </Button>
            <Button vertical>
                <Icon name="book" />
                <Text>{strings.dairy}</Text>
            </Button>
             <CameraComponent vertical />
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

            //   <Button badge vertical>
            //     <Badge><Text>2</Text></Badge>
            //     <Icon name="paper" />
            //     <Text>Día</Text>
            //   </Button>
            // <Button active badge vertical>
            //   <Badge ><Text>51</Text></Badge>
            //   <Icon active name="map" />
            //   <Text>{strings.map}</Text>
            // </Button>
            //   <CameraComponent vertical />
            // <Button vertical>
            //   <Icon name="person" />
            //   <Text>{strings.profile}</Text>
            // </Button>