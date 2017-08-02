'use strict';
import {
  AppRegistry,
  Alert,
  Text,
  AsyncStorage,
} from 'react-native';

import { Container, Content,Form, Item, Input, Label, Button, Icon, Spinner, Body} from 'native-base';
import React, {Component} from 'react';
import {getAuth} from '../common/database';
import strings from '../common/local_strings.js';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class Login extends Component {

  static navigationOptions = {
    header: null,
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showToast: false,
      showSpinner: false
    }
  }

  login() {
    const { navigate } = this.props.navigation;
    //this.setState({ showSpinner: true });
    try {
      MessageBarManager.registerMessageBar(this.refs.alert);
      getAuth().signInWithEmailAndPassword(this.state.email,
        this.state.password).then(function(firebaseUser) {
          AsyncStorage.setItem("user", firebaseUser.uid);
          navigate('dtTabs');

      }).catch(function(error) {
        //this.setState({ showSpinner: false });
        MessageBarManager.showAlert({
           message: strings.wrongPassEmail,
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
             { this.state.showSpinner ? <Spinner /> : null }

             <Form>
              <Item floatingLabel>
                  <Label>{strings.email}</Label>
                  <Input
                   autoCorrect = {false}
                   keyboardType = {'email-address'}
                   onChangeText = {(text) => this.setState({email: text})}
                   value = {this.state.email}/>
              </Item>
              <Item floatingLabel>
                  <Label>{strings.password}</Label>
                  <Input
                  onChangeText = {(text) => this.setState({password: text})}
                  value = {this.state.password}
                  secureTextEntry = {true}/>
              </Item>
              <Button block info onPress = {this.login.bind(this)} style={{marginTop:15,backgroundColor: '#70041b'}}>
                 <Text style={{color:'white'}}>{strings.loging}</Text>
              </Button>
              <Body>
                <Button transparent light onPress={() => navigate('getPassword')}  style={{marginTop:15, flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize:15}}>{strings.forgetpass}</Text>
                </Button>
              </Body>

             </Form>

               <Body style={{marginTop:35}}>
                <Button transparent light onPress={() => navigate('signup')}  style={{flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize:20}}>{strings.signup}</Text>
                </Button>
               </Body>
             </Content>
             <MessageBarAlert ref="alert" />
           </Container>

    );
  }
}
