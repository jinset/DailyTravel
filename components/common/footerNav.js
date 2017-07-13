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
import strings from '../common/local_strings.js'

 export default class FooterNav extends Component {
  render() {
    return (
      <View>
        <Footer>
          <FooterTab>
            <Button active badge vertical>
              <Badge><Text>2</Text></Badge>
              <Icon  name="home" />
            </Button>
             <Button badge vertical>
                <Badge><Text>2</Text></Badge>
                <Icon name="book" />
                <Text>{strings.dairy}</Text>
              </Button>
              <Button badge vertical>
                <Badge><Text>2</Text></Badge>
                <Icon name="paper" />
                <Text>Día</Text>
              </Button>
            <Button  badge vertical>
              <Badge ><Text>51</Text></Badge>
              <Icon  name="map" />
              <Text>{strings.map}</Text>
            </Button>
            <Button vertical>
              <Icon name="camera" />
            </Button>
            <Button vertical>
              <Icon name="person" />
              <Text>{strings.profile}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}
