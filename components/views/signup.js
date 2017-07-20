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
import { Container, Content,Form, Item, Input, Label, Button,Toast, Left, Right, ListItem} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { Icon } from 'react-native-elements';



export default class Signup extends Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    headerTitle: strings.signup,
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  };

  constructor(props) {
    super(props);
    console.disableYellowBox = true;
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
    if (that.name == '' || that.lastName == '' || that.email == '' || that.password == '' || that.country == '' || that.nickname == '') {
      Toast.show({
              text: strings.blankinputs,
              position: 'bottom',
              buttonText: 'Okay'
            })
    }else{
      const { goBack } = this.props.navigation;
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
            goBack();
          })
        }else{
          Toast.show({
                  text: strings.nicknameExits,
                  position: 'bottom',
                  buttonText: 'Okay'
                })
        }
      })
    }
}

  render() {

    return (
      <Container>
             <Content>
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
                  <Label>{strings.name}</Label>
                  <Input
                  onChangeText = {(text) => this.setState({name: text})}
                  value = {this.state.name}/>
              </Item>
              <Item floatingLabel>
                  <Label>{strings.lastName}</Label>
                  <Input
                  onChangeText = {(text) => this.setState({lastName: text})}
                  value = {this.state.lastName}/>
              </Item>
              <Item floatingLabel>
                  <Label>{strings.password}</Label>
                  <Input
                  onChangeText = {(text) => this.setState({password: text})}
                  value = {this.state.password}
                  secureTextEntry = {true}/>
              </Item>
              <Item floatingLabel>
                  <Label>{strings.nickname}</Label>
                  <Input
                  autoCorrect = {false}
                  onChangeText = {(text) => this.setState({nickname: text})}
                  value = {this.state.nickname}/>
              </Item>
              <ListItem>
                <Left>
                  <Text style={{fontSize:17}}>{strings.birthday}</Text>
                </Left>
                <Right>
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
                />
                </Right>

              </ListItem>
               <ListItem>
                    <ModalDropdown
                      defaultValue={strings.country}
                      options={Countries}
                      textStyle={styles.dropdownModal}
                      dropdownStyle={styles.dropdown}
                      dropdownTextStyle={styles.textDropdown}
                      onSelect={(index,value)=>{this.state.country = value}}
                    />
                    </ListItem>
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
    fontSize: 17,
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
