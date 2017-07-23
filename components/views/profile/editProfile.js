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
import Accordion from 'react-native-accordion';
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

    componentDidMount(){
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
        alert("error: " + error)
      }
    }

   save(){
     const {goBack} = this.props.navigation;
     let nick = this.state.inputNickname;
     try{
         MessageBarManager.registerMessageBar(this.refs.alert);
         //Helper.setUserNickname(this.state.uid, this.state.inputNickname)
         Helper.setUserName(this.state.uid, this.state.inputName)
         Helper.setUserLastName(this.state.uid, this.state.inputLastName)
         Helper.setUserEmail(this.state.uid, this.state.inputEmail)
         Helper.setUserBirthDay(this.state.uid, this.state.inputBirthDay)

         let userNamePath = "/users/"+this.state.uid+"/nickname"
         let checkNick = getDatabase().ref('/users').orderByChild("nickname").equalTo(nick);
         checkNick.once('value', function(snapshot) {
             if (snapshot.exists() == false) {
               goBack()
               return getDatabase().ref(userNamePath).set(nick)
            }else{
              MessageBarManager.showAlert({
                 title: 'Nickname',
                 message: strings.nicknameExits,
                 alertType: 'info',
                 position: 'bottom',
                 duration: 4000,
                 stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
              });
              return null
            }
         })
     } catch(error){

     }
   }

   logout() {
     const { navigate } = this.props.navigation;
     AsyncStorage.removeItem("user");
     navigate('login');
   }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
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
                        <Item >
                            <Icon active name='mail' />
                            <Input placeholder={params.email}
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
            <MessageBarAlert ref="alert" />
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
