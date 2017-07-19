'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  AsyncStorage
} from 'react-native';

import Countries from '../common/countries.json';
import {getAuth, getDatabase} from '../common/database';
import strings from '../common/local_strings.js';

import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content,Form, Item, Input, Label, Button,Toast} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';


export default class Signup extends Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    headerTitle: strings.signup,
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      country: '',
      date: new Date().toLocaleDateString(),
      nickname: '',
      url:'https://firebasestorage.googleapis.com/v0/b/daily-travel-6ff5f.appspot.com/o/images%2Fno-profile-img.jpg?alt=media&token=a8a44bb4-5455-46b6-9fda-329b3e39c5d7',
    }
  }

  add() {
    var that = this.state;
    var checkNick = getDatabase().ref('/users').orderByChild("nickname").equalTo(this.state.nickname);
    checkNick.once('value', function(snapshot) {
      if (snapshot.exists() == false) {
        getAuth().createUserWithEmailAndPassword(that.email,
          that.password).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
        }).then(function(firebaseUser) {
          getDatabase().ref().child('users/' + firebaseUser.uid).update({
            status: 'act',
            name: that.name,
            lastName: that.lastName,
            email: that.email,
            admin: false,
            birthPlace: that.country,
            bornDay: that.date,
            nickname: that.nickname,
            url: that.url
          });
            navigate('login');
        })
      }else{
        alert('error')
        // Toast.show({
        //         text: strings.nicknameExits,
        //         position: 'bottom',
        //         buttonText: 'Okay'
        //       })
      }
    })
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
                  <Label>Name</Label>
                  <Input
                  onChangeText = {(text) => this.setState({name: text})}
                  value = {this.state.name}/>
              </Item>
              <Item floatingLabel>
                  <Label>Last Name</Label>
                  <Input
                  onChangeText = {(text) => this.setState({lastName: text})}
                  value = {this.state.lastName}/>
              </Item>
              <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                  onChangeText = {(text) => this.setState({password: text})}
                  value = {this.state.password}
                  secureTextEntry = {true}/>
              </Item>
              <Item floatingLabel>
                  <Label>Nickname</Label>
                  <Input
                  onChangeText = {(text) => this.setState({nickname: text})}
                  value = {this.state.nickname}/>
              </Item>
              <ModalDropdown
                  defaultValue={"Country"}
                  options={Countries}
                  textStyle={styles.dropdownModal}
                  dropdownStyle={styles.dropdown}
                  dropdownTextStyle={styles.textDropdown}
                  onSelect={(index,value)=>{this.state.country = value}}
                  />
                  <DatePicker
                    style={{width: 150}}
                       date={Moment(this.state.date, 'MM/DD/YY')}
                       mode="date"
                       placeholder="select date"
                       format="MM/DD/YY"
                       //minDate="2016-05-01"
                       maxDate={Moment(this.state.date, 'MM/DD/YY')}
                       confirmBtnText="Confirm"
                       cancelBtnText="Cancel"
                       customStyles={{
                         dateIcon: {
                             position: 'absolute',
                             left: 0,
                             top: 4,
                           marginLeft: 0
                         },
                       dateInput: {
                           marginLeft: 36
                       }
                     }}
                     onDateChange={(date) => {this.setState({date: date})}}
                  >
                  <Text>Born day</Text>
                  </DatePicker>
             </Form>


               <Button onPress = {this.add.bind(this)} full light style= {{backgroundColor: '#D3D0CB'}}>
                  <Text style={{color:'white'}}>{strings.signup}</Text>
               </Button>
              </Content>
           </Container>

    );
  }
}
const styles = StyleSheet.create({

  dropdownModal: {
    fontSize: 20,
    paddingLeft: 15,
    paddingTop: 10,
  },

  dropdown: {
    position: 'relative',
    //fontSize: 25,
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  textDropdown:{
    fontSize:15
  },
});
