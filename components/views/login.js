'use strict';
import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert
} from 'react-native';
import styles from '../style/baseStyles.js';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Item, Input, Label, Button,Text,Body, Right, Switch  } from 'native-base';
  const firebaseConfig = {
  apiKey: "AIzaSyCdf_99OpPdugQPtnK6wh08P9QDlamdnG8",
 authDomain: "daily-travel-6ff5f.firebaseapp.com",
 databaseURL: "https://daily-travel-6ff5f.firebaseio.com",
 projectId: "daily-travel-6ff5f",
 storageBucket: "daily-travel-6ff5f.appspot.com",
 messagingSenderId: "651940849732"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);


class LoginView extends Component {

  static navigationOptions = {
    header: null,
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Aqui para ingresar </Text>
        <Button block light
        onPress={() => navigate('Chat', { user: 'Lucy' })}>
           <Text>Registrarme</Text>

         </Button>

        <Text>Aqui agregar diario </Text>
        <Button block light
        onPress={() => navigate('diario', { user: 'Lucy' })}>
        <Text>Agregar diario</Text>
        </Button>

      </View>
    );
  }
}


class NewAccount extends Component {
  add(){
    firebaseApp.auth().createUserWithEmailAndPassword('maasasssd@gads.com' , '1sadsdsasadadsdsad').catch(function(error){
      var errorCode = error.code;
       var errorMessage = error.message;
       if (errorCode == 'auth/weak-password') {
    alert('The password is too weak.');
  } else {
    alert(errorMessage);
  }
    }).then(function(firebaseUser){
      firebaseApp.database().ref().child('users/' + firebaseUser.uid).update({
        lastName: 'name'
      });
      Alert.alert("Cuenta agregada con exito ");
    })
  }


  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar una cuenta',
  };
  render() {
    return (
      <View>
       <Text>sadsad </Text>
       <Button block light
        onPress={() => this.add()}>
       <Text>Agregar </Text>
       </Button>
     </View>
    );
  }
}
class NewDiary extends Component {
  add(){
    firebaseApp.auth().createUserWithEmailAndPassword('maasasssd@gads.com' , '1sadsdsasadadsdsad').then(function(firebaseUser){
      firebaseApp.database().ref().child('users/' + firebaseUser.uid).update({
        lastName: 'name'
      });
      Alert.alert("Diario agregada con exito ");
    })
  }
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar una diario',
  };
  render() {
    return (

        <Container>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Name</Label>
                <Input />
              </Item>
              <Item stackedLabel last>
                <Label>Description</Label>
                <Input />
              </Item>
              <Item stackedLabel last>
                <Label>Culture</Label>
                <Input />
              </Item>

                <Right>
                <Label>Privacy</Label>
                  <Switch value={false} />
                </Right>

              <Button block>
                <Text>Save</Text>
              </Button>
            </Form>

          </Content>
        </Container>
    );
  }
}

const DailyTravel = StackNavigator({
  Home: { screen: LoginView },
  Chat: { screen: NewAccount },
  diario: { screen: NewDiary },
});

AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
