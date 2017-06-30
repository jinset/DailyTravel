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

  login(){
    getAuth().signInWithEmailAndPassword(this.state.email,
      this.state.password).then(function(firebaseUser) {
      Alert.alert("hace login usario ID" + firebaseUser.uid);
    }).catch(function(error) {
      Alert.alert(error);
    });
  }
  render() {

    return (
      <Container>
             <Content>
             <Form>
              <Item floatingLabel>
                  <Label>Email Address</Label>
                  <Input
                   onChangeText = {(text) => this.setState({email: text})}
                   value = {this.state.email}/>
              </Item>

              <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                  onChangeText = {(text) => this.setState({password: text})}
                  value = {this.state.password}
                  secureTextEntry = {true}/>
              </Item>


             </Form>
               <Button block info onPress = {this.login.bind(this)} style={{marginTop:15}}>
                  <Text style={{color:'white'}}>Login</Text>
               </Button>

             </Content>
           </Container>

    );
  }
}




module.export = Login;
