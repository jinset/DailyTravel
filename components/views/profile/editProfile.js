import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert,
  ListView,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Segment, Item, Toast, Input, Label, Button, Text,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import Helper from './helper';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class EditProfile extends Component {
  static navigationOptions = {
    title: strings.profile,
    headerStyle: {backgroundColor: '#70041b', height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  }
   constructor(props) {
       super(props);
       console.disableYellowBox = true;
       this.state = {
         uid: '',
         inputNickname: '',
         inputName: '',
         inputLastName: '',
         inputNickname: '',
         inputEmail: '',
         inputBirthDay: '',
       }
    }

    componentWillMount(){
      const { params } = this.props.navigation.state;
      try{
        this.setState({
          uid: params.uid,
          inputNickname: params.nickname,
          inputName: params.userName,
          inputLastName: params.lastName,
          inputEmail: params.email,
          inputBirthDay: params.birthday,
        })
      } catch(error){
        alert("error componentDidMount: " + error.code)
      }
    }

   save(){
     const {goBack} = this.props.navigation;
     const { params } = this.props.navigation.state;
     const { navigate } = this.props.navigation;
     //let nick = this.state.inputNickname;
     let email = this.state.inputEmail;
     var that = this.state;
     try{
         MessageBarManager.registerMessageBar(this.refs.alert);
         // Validate if there is empty values /////////////////////////////////////////////////////////
         if (that.inputNickname == ''|| that.inputName == ''||
             that.inputLastName == '' || that.inputEmail == ''){

                 MessageBarManager.showAlert({
                    title: 'Campos',
                    message: strings.blankinputs,
                    alertType: 'info',
                    position: 'bottom',
                    duration: 4000,
                    stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
                 });
          }else{
            let checkNick = getDatabase().ref('/users').orderByChild("nickname").equalTo(that.inputNickname);
            checkNick.once('value', function(snapshot) {
               // Validate if a nickname exits or input nickname repeated /////////////
               if(snapshot.exists() == true && params.nickname !== that.inputNickname){
                 MessageBarManager.showAlert({
                    title: strings.nickname,
                    message: strings.nicknameExits,
                    alertType: 'info',
                    position: 'bottom',
                    duration: 4000,
                    stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
                 });//MessageBarManager nicknameExits
               }else{
                 let emailPath = "/users/"+that.uid+"/email"
                 var user = firebase.auth().currentUser;
                      user.updateEmail(that.inputEmail).then(function(){
                            getDatabase().ref(emailPath).set(that.inputEmail)
                            getDatabase().ref().child('users/' + that.uid).update({
                              nickname: that.inputNickname,
                              name: that.inputName,
                              lastName: that.inputLastName,
                              email: that.inputEmail,
                              bornDay: that.inputBirthDay,
                            }); //update user
                            goBack()
                      }, function(error) {
                          if(error.code === 'auth/requires-recent-login'){
                            MessageBarManager.showAlert({
                                title: "Reinicia sesión para cambiar el correo",
                                message: "Toque este mensaje si desea cerrar sesión",
                                alertType: 'info',
                                position: 'bottom',
                                duration: 15000,
                                stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' },
                                onTapped: () =>{
                                                AsyncStorage.removeItem("user")
                                                navigate('login')
                                              },
                            }) // MessageBarManager please login again
                          }else // If requires-recent-login
                            if(error.code === 'auth/invalid-email'){
                              MessageBarManager.showAlert({
                                  title: "Correo",
                                  message: "Correo mal redactado",
                                  alertType: 'info',
                                  position: 'bottom',
                                  duration: 4000,
                                  stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' },
                              }) // MessageBarManager please login again
                          }else{
                            alert("unknown error: "+error.code)
                          }
                       }); // user.updateEmail error
               }// snapshot.exists == true
            })// checkNick.once
         }// else blanckinputs
     } catch(error){
<<<<<<< HEAD

=======
       alert("Error desconocido"+error.code)
>>>>>>> 1d5bd4e5155b3556e6203e6f98eb407dc8e08050
     }
   }// save()

   logout() {
     const { navigate } = this.props.navigation;
     AsyncStorage.removeItem("user");
     navigate('login');
   }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    return (
          <Container>
            <Content>
              <Form>
               <View style={styles.centerCamera}>
                    <CameraComponent />
                    <Icon active large onPress={this.logout.bind(this)} name='exit-to-app' />
                    <Text>{strings.changePerfilPhoto}</Text>
               </View>
                <Card>
                        <Item >
                            <Icon active name='loyalty' />
                            <Input placeholder={params.nickname}
                                   onChangeText={(text) => this.setState({inputNickname: text})}
                                   maxLength = {20} />
                        </Item>
                        <Item >
                            <Icon active name='person' />
                            <Input placeholder={params.userName}
                                   onChangeText={(text) => this.setState({inputName: text})}
                                   maxLength = {20} />
                        </Item>
                        <Item >
                            <Icon active name='person' />
                            <Input placeholder={params.lastName}
                                   onChangeText={(text) => this.setState({inputLastName: text})}
                                   maxLength = {20}/>
                        </Item>
                        <Item>
                              <DatePicker
                                iconComponent={ <Icon active name='cake' /> }
                                style={{width: 20}}
                                date={params.birthday}
                                mode="date"
                                hideText={true}
                                placeholder="select date"
                                format="MM/DD/YYYY"
                                minDate="01/01/1920"
                                maxDate="01/01/2010"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{

                                }}
                                onDateChange={(date) => {this.setState({inputBirthDay: date})}}
                              />
                            <Label>{"   " + this.state.inputBirthDay}</Label>
                          </Item>
                </Card>
                <Left >
                    <View style={styles.privateInfo}>
                    <Text>
                        {strings.privateInformation}
                    </Text>
                    </View>
                </Left>
                <Card>
                        <Item>
                            <Icon active name='mail' />
                            <Input placeholder={params.email}
                              autoCorrect = {false}
                              keyboardType = {'email-address'}
                              onChangeText={(text) => this.setState({inputEmail: text})}/>
                        </Item>
                        <Item >
                            <Input placeholder={strings.changePassword}
                                   secureTextEntry={true}
                                   maxLength={20} />
                            <Icon active name='keyboard-arrow-down' />
                        </Item>
                </Card>
                <Card>
                    <Button full light style= {{backgroundColor: '#D3D0CB'}}
                            onPress={this.save.bind(this)}>
                        <Text>{strings.save}</Text>
                    </Button>
                </Card>
              </Form>
            </Content>
            <MessageBarAlert
                        ref="alert"
                        onTapped={() =>{
                            alert("aaa")
                        }}/>
          </Container>
    );
  }

}

const styles = StyleSheet.create({
  centerCamera: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 15,
  },
  privateInfo: {
    paddingTop: 15,
  },
  title: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});
