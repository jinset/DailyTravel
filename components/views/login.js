'use strict';
import {
  AppRegistry,
  Alert,
  Text,
  AsyncStorage,
} from 'react-native';

import { Container, Content,Form, Item, Input, Label, Button,Toast, Icon, Spinner} from 'native-base';
import React, {Component} from 'react';
import {getAuth} from '../common/database';
import strings from '../common/local_strings.js';

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
    getAuth().signInWithEmailAndPassword(this.state.email,
      this.state.password).then(function(firebaseUser) {
        AsyncStorage.setItem("user", firebaseUser.uid);
        navigate('dtTabs');
        
    }).catch(function(error) {
      //this.setState({ showSpinner: false });
      Toast.show({
              text: strings.wrongPassEmail,
              position: 'bottom',
              buttonText: 'Okay'
            })
    });
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
               <Button block info onPress = {this.login.bind(this)} style={{marginTop:15,backgroundColor: '#70041b'}}>
                  <Text style={{color:'white'}}>{strings.loging}</Text>
               </Button>
                <Button transparent light onPress={() => navigate('signup')}  style={{marginTop:15, flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}}>
                  <Text style={{textAlign: 'center'}}>{strings.signup}</Text>
                </Button>
             </Content>
           </Container>

    );
  }
}
