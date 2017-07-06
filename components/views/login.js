'use strict';
import {
  AppRegistry,
  Text,
  Alert,
} from 'react-native';

import { Container, Content,Form, Item, Input, Label, Button} from 'native-base';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {getAuth} from '../common/database';
import CameraComponent from './CameraComponent'
import strings from '../common/local_strings.js'
import Signup from './signup';
import Diary from './diary';


export default class Login extends Component {

  static navigationOptions = {
    header: null,
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  login() {
    const { navigate } = this.props.navigation;
    getAuth().signInWithEmailAndPassword(this.state.email,
      this.state.password).then(function(firebaseUser) {
      navigate('Diary');
    }).catch(function(error) {
      alert(error);
    });
  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container style={{flex: 1,marginTop:90}}>
             <Content>
             <Form>
              <Item floatingLabel>
                  <Label>{strings.email}</Label>
                  <Input
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
             </Form>
               <Button block info onPress = {this.login.bind(this)} style={{marginTop:15}}>
                  <Text style={{color:'white'}}>{strings.loging}</Text>
               </Button>
                <Button transparent light onPress={() => navigate('Signup')}  style={{marginTop:15, flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}}>
                  <Text style={{textAlign: 'center'}}>{strings.singup}</Text>
                </Button>
             </Content>
           </Container>

    );
  }
}


const DailyTravel = StackNavigator({
  Login: { screen: Login },
  Signup: { screen: Signup },
  Diary: { screen: Diary },

});

AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
