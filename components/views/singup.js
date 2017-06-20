'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Button
} from 'react-native';

import styles from '../style/baseStyles.js';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';

class NewAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,
      // entered credentials
      email: '',
      password: ''
    }
  }

  signup() {
     this.setState({
       // When waiting for the firebase server show the loading indicator.
       loading: true
     });
     // Make a call to firebase to create a new user.
     this.props.firebaseApp.auth().createUserWithEmailAndPassword(
       this.state.email,
       this.state.password).then(() => {
         // then and catch are methods that we call on the Promise returned from
         // createUserWithEmailAndPassword
         alert('Your account was created!');
         this.setState({
           // Clear out the fields when the user logs in and hide the progress indicator.
           email: '',
           password: '',
           loading: false
         });
     }).catch((error) => {
       // Leave the fields filled when an error occurs and hide the progress indicator.
       this.setState({
         loading: false
       });
       alert("Account creation failed: " + error.message );
     });
   }
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar una cuenta',
  };
  render() {
    return (
      <View>
       <TextInput
         style={styles.textInput}
         onChangeText={(text) => this.setState({email: text})}
         value={this.state.email}
         placeholder={"Email Address"} />
       <TextInput
         style={styles.textInput}
         onChangeText={(text) => this.setState({password: text})}
         value={this.state.password}
         secureTextEntry={true}
         placeholder={"Password"} />
       <TouchableHighlight onPress={this.signup.bind(this)} style={styles.primaryButton}>
         <Text style={styles.primaryButtonText}>Signup</Text>
       </TouchableHighlight>
     </View>
    );
  }
}
