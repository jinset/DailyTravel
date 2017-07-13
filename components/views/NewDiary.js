import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Item, Input, Label, Button ,Text,Body,CheckBox ,ActionSheet, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../common/local_strings.js';
import FooterNav from  '../common/footerNav.js';
import { getDatabase } from '../common/database';
import  CreateDaily  from './createDaily.js';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { DialogTitle } from 'react-native-popup-dialog';
import * as firebase from 'firebase';
import  CameraDiary  from '../common/CameraDiary';
var BUTTONS = [
  'Option 0',
  'Option 1',
  'Option 2',
  'Delete',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;
var newRef =''; 
var usuario =''; 
 export default class NewDiary extends Component {
  constructor(props){
    super(props)
    this.state = {
      idOwner:'',
      name: '',      
      status: true,
      privacy: false,
      date:'',
      description: '',
      culture: '',
      url:'',

    }
  }

//Obtiene el usuario loggeado
   async componentDidMount(){
     try{
       let user = await firebase.auth().currentUser
          usuario= user.uid;
     } catch(error){
       alert("error: " + error)
     }
   }
  //Cambia la privacidad
  privacyChange(){
    this.setState( {privacy: !this.state.privacy})
  }
   //Agrega el diario 
  add(){
     getDatabase().ref().child('diary/').push().set({
      idOwner:usuario,
      name:this.state.name,
       name:this.state.name,
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,
       status:this.state.status,
   }).catch(function(error) {
       alert(error);
  });

       alert("Diario agregado ");
}
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar Diario',
  };
  render() {
    return (

        <Container>
          <Content>
            <Form>
            <CameraDiary/>
              <Right>
                <Label>{strings.privacy }</Label>
                <Switch 
                value={ this.state.privacy }
                onValueChange={this.privacyChange.bind( this ) }/>
              </Right>
              <Item floatingLabel>
                <Label>{strings.name }</Label>
                <Input onChangeText={(text) => this.setState({name:text})}
                returnKeyLabel = {"next"} />
              </Item>
              <Item floatingLabel>
                <Label>{strings.description }</Label>
                <Input onChangeText={(text) => this.setState({description:text})}
                returnKeyLabel = {"next"}/>
              </Item>
              <Item floatingLabel>
                <Label>{strings.culture }</Label>
                <Input onChangeText={(text) => this.setState({culture:text})}
                returnKeyLabel = {"next"} />
              </Item>
               <Button rounded light>
                  <Icon name='people' />
                  <Text>{strings.guest }</Text>
                </Button> 

            </Form>
          </Content>
              <Button full
               onPress={() => this.add()}>
               <Text>{strings.save }</Text>
              </Button>   
        </Container>


    );
  }
}


//para los invitados
  //   var myRef = getDatabase().ref().push();
  //      var key =myRef.key;    
  //      getDatabase().ref().child('userDiary/').push({
  //      idUser:'4IjaDG6AyTSv2E5KBkChr5DKfMt2',
  //      idDiary: key,
  //      status:this.state.status,
  //  }).catch(function(error) {
  //      alert(error);
  // });