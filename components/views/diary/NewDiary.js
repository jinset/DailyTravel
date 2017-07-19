import {
  AppRegistry,
  TextInput,
  View,StyleSheet,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert,ListView ,Dimensions,
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content,Header,Picker, Form,List,ListItem,Radio, Item,Title, Input, Label, Button ,Text,Body,CheckBox ,ActionSheet, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../../common/local_strings.js';
import FooterNav from  '../../common/footerNav.js';
import { getDatabase } from '../../common/database';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { DialogTitle } from 'react-native-popup-dialog';
import * as firebase from 'firebase';
import  CameraDiary  from './CameraDiary';

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
      url:'https://firebasestorage.googleapis.com/v0/b/daily-travel-6ff5f.appspot.com/o/images%2Fdiary%2FdefultDiary.png?alt=media&token=238cc03e-2a95-426a-8d32-7adf0e52bd6f',

    }
  }

//Obtiene el usuario loggeado
   async componentDidMount(){
     try{
       AsyncStorage.getItem("user").then((value) => {
          usuario= value;
        })
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
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,
       url:this.state.url,
       status:this.state.status,
   }).catch(function(error) {
        Toast.show({
              text: strings.wrongPassEmail,
              position: 'bottom',
              buttonText: 'Okay'
            })
  });
    const { navigate } = this.props.navigation;
     navigate('profile');
}
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: strings.diary,
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  }
  render() {
    return (

        <Container>
          <Content>
            <Form>
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

            </Form>
          </Content>
              <Button full light style= {{backgroundColor: '#D3D0CB'}}
               onPress={() => this.add()} >
               <Text>{strings.save }</Text>
              </Button>
        </Container>
    );
  }
}


{/*//para los invitados
  //   var myRef = getDatabase().ref().push();
  //      var key =myRef.key;
  //      getDatabase().ref().child('userDiary/').push({
  //      idUser:'4IjaDG6AyTSv2E5KBkChr5DKfMt2',
  //      idDiary: key,
  //      status:this.state.status,
  //  }).catch(function(error) {
  //      alert(error);
  // });

  class ListAvatarExample extends Component {
  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={{ uri: 'data:image/jpeg;base64,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' }} />
              </Left>
              <Body>
                <Text>Kumar Pratik</Text>
              </Body>
            <Right>
              <Radio selected={true} />
            </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
*/}
