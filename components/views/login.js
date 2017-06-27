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
import { Container, Content, Form, Item, Input, Label, Button,Text,Body, Right, Switch, Icon  } from 'native-base';
import strings from '../common/local_strings.js'
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

         <Icon active name='bookmarks' />
        <Button block light
        onPress={() => navigate('diario', { user: 'Lucy' })}>
        <Text>{strings.dairy}</Text>
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
  constructor(props){
    super(props)
    this.state = {
      name: '',
      description: '',
        culture: '',
        privacy: ''
    }
  }
  add(){
     firebaseApp.database().ref().child('dairies/').push().set({
     dahhiry: {
       name:this.state.name,
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,

     }
   });
/*  add(name_,description_,culture_,privacy_){
    firebaseApp.database().ref().child('dairies/').set({
    name_: {
      description:description_,
      culture: culture_,
      privacy:privacy_

    }
  });*/
}
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title:strings.dairy,
  };
  render() {
    return (

        <Container>
          <Content>
            <Form>
              <Item stackedLabel>
              <Text>{strings.name }</Text>
                <Input onChangeText={(text) => this.setState({name:text})}
                returnKeyLabel = {"next"} />
              </Item>
              <Item stackedLabel >
              <Text>{strings.description }</Text>
                <Input onChangeText={(text) => this.setState({description:text})}
                returnKeyLabel = {"next"}/>
              </Item>
              <Item stackedLabel last>
              <Text>{strings.culture }</Text>
                <Input
                onChangeText={(text) => this.setState({culture:text})}
                returnKeyLabel = {"next"} />
              </Item>
                <Right>

                <Text>{strings.privacy }</Text>
                  <Switch value={true}
                  onChangeText={(text) => this.setState({privacy:text})}
                  returnKeyLabel = {"next"} />
                </Right>

              <Button block
               onPress={() => this.add()}>
               <Text>{strings.save }</Text>
              </Button>

            </Form>
          </Content>
        </Container>

    );
  }
}

class AwesomeProject extends Component {

  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  onPasswordChange(password) {
     alert("respuesta"+password )
  }

  render() {
    return (
      <View style={styles.content}>

    <Input
      style={styles.textInputStyle}
      placeholder="Enter Password"
      returnKeyLabel = {"next"}
      onChangeText={this.onPasswordChange} />
        <Button style={styles.buttonStyle}>

        <Text>adnñj</Text>
        </Button>

        </View>
    );
  }
}
const DailyTravel = StackNavigator({
  Home: { screen: LoginView },
  Chat: { screen: NewAccount },
  diario: { screen: NewDiary },
});

AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
