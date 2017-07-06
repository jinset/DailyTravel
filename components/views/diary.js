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
import { Container, Content, Form, Item, Input, Label, Button,Text,Body, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge ,Fab } from 'native-base';
import strings from '../common/local_strings.js';
import { getDatabase } from '../common/database';
import FooterNav from  '../common/footerNav.js';
import Daily1 from  './createDaily.js';
import Login from  './login.js';

 export default class DairyView extends Component {
  static navigationOptions = {
    title: 'Diario',
  };
  constructor(props) {
    super(props);
    this.state = {
      active: 'false'
    };
  }

  render() {
        const { navigate } = this.props.navigation;
    return (

      <Container>
        <Content>
          <View style={{ flex: 1 }}>
            <Fab
              active={this.state.active}
              direction="down"
              containerStyle={{ }}
              style={{ backgroundColor: 'black' }}
              position="topRight"
              onPress={() => navigate('Daily')}>
              <Icon name="calendar" />
            </Fab>  <Fab
              active={this.state.active}
              direction="down"
              containerStyle={{ }}
              style={{ backgroundColor: 'red' }}
              position="topLeft"
              onPress={() => navigate('Daily1')}>
              <Icon name="calendar" />
            </Fab>
          </View>

          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'http://concepto.de/wp-content/uploads/2015/03/Paisaje.jpg'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>GeekyAnts</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </Content>
        <FooterNav></FooterNav>
      </Container>
    );
  }
}

const DailyTravel2 = StackNavigator({
  Daily1: { screen: Daily1 },
});

module.export = DailyTravel2;