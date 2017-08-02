'use strict';
import {
  AppRegistry,
  Alert,
  Text,
  AsyncStorage,
} from 'react-native';

import { Container, Content,Form, Item, Input, Label, Button, Icon, Body} from 'native-base';
import React, {Component} from 'react';
import {getAuth} from '../common/database';
import strings from '../common/local_strings.js';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class GetPassword extends Component {

  static navigationOptions = {
    header: null,
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  getPassword() {
    try {
      MessageBarManager.registerMessageBar(this.refs.alert);
      var that = this.state
      getAuth().sendPasswordResetEmail(this.state.email).then(function() {
        MessageBarManager.showAlert({
           message: strings.checkEmail + " " + that.email,
           alertType: 'info',
           position: 'bottom',
           duration: 4000,
           stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
        });
      }).catch(function(error) {
        MessageBarManager.showAlert({
           message: strings.unknowEmail,
           alertType: 'info',
           position: 'bottom',
           duration: 4000,
           stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
        });
      });
    } catch (e) {
      console.log(e);
    }

  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container style={{flex: 1,marginTop:90}}>
             <Content padder>
             <Form>
              <Item floatingLabel>
                  <Label>{strings.email}</Label>
                  <Input
                   autoCorrect = {false}
                   keyboardType = {'email-address'}
                   onChangeText = {(text) => this.setState({email: text})}
                   value = {this.state.email}/>
              </Item>
              <Button block info onPress = {this.getPassword.bind(this)} style={{marginTop:15,backgroundColor: '#70041b'}}>
                 <Text style={{color:'white'}}>{strings.changePassword}</Text>
              </Button>
             </Form>
             </Content>
             <MessageBarAlert ref="alert" />
           </Container>

    );
  }
}
