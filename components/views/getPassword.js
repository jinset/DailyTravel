'use strict';
import {
  AppRegistry,
  Alert,
  Text,
  AsyncStorage,
} from 'react-native';

import { Container, Content,Form, Item, Input, Label, Button, Icon, Body, Spinner} from 'native-base';
import React, {Component} from 'react';
import {getAuth} from '../common/database';
import strings from '../common/local_strings.js';
import HideableView from 'react-native-hideable-view';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class GetPassword extends Component {

  static navigationOptions = {
    headerTitle: strings.forgetpass,
    headerStyle: {backgroundColor: '#41BEB6',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  };

  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.state = {
      email: '',
      showSpinner: false
    }
  }

  getPassword() {
    try {
      MessageBarManager.registerMessageBar(this.refs.alert);
      var that = this.state
      // this.setState({ showSpinner: true });
      getAuth().sendPasswordResetEmail(this.state.email).then(function() {
        // this.setState({ showSpinner: false });
        MessageBarManager.showAlert({
           message: strings.checkEmail + " " + that.email,
           alertType: 'info',
           position: 'bottom',
           duration: 4000,
           stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
        });
      }).catch(function(error) {
        // this.setState({ showSpinner: false });
        MessageBarManager.showAlert({
           message: strings.unknowEmail,
           alertType: 'info',
           position: 'bottom',
           duration: 4000,
           stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
        });
      });
    } catch (e) {
      // this.setState({ showSpinner: false });
      console.log(e);
    }

  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container style={{flex: 1,marginTop:90}}>
             <Content padder>
             <HideableView visible={this.state.showSpinner} removeWhenHidden={true} style={{backgroundColor:'transparent'}}>
                <Spinner color='#41BEB6' />
             </HideableView>
             <Form>
              <Item floatingLabel>
                  <Label>{strings.email}</Label>
                  <Input
                   autoCorrect = {false}
                   keyboardType = {'email-address'}
                   onChangeText = {(text) => this.setState({email: text})}
                   value = {this.state.email}/>
              </Item>
              <Button block info onPress = {this.getPassword.bind(this)} style={{marginTop:15,backgroundColor: '#41BEB6'}}>

                 <Text style={{color:'white'}}>{strings.changePassword}</Text>
              </Button>
             </Form>
             </Content>
             <MessageBarAlert ref="alert" />
           </Container>

    );
  }
}
