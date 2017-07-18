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
import { Container, Content, Form, Item, Input, Label, Button,Text,Body, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import Helper from '../../common/helper';
import * as firebase from 'firebase';

 export default class Profile extends Component {

   constructor(props) {
       super(props);
       this.state = {
         uid: '',
         userName: '',
         lastName: '',
         dairys: '',
       }
    }

   static navigationOptions = {
    header: null,
    title: strings.dairy,
   };

   async componentDidMount(){
     try{
       let user = await firebase.auth().currentUser
       Helper.getUserName(user.uid, (name) => {
         this.setState({
           userName: name,
         })
       })
       Helper.getUserLastName(user.uid, (lastname) => {
         this.setState({
           lastName: lastname,
         })
       })
       Helper.getDairysByUser(user.uid, (dairys) => {
         this.setState({
           dairys: dairys,
         })
       })
       this.setState({
          uid: user.uid,
       })
     } catch(error){
       alert("error: " + error)
     }
   }

  render() {
        //const { navigate } = this.props.navigation;
    return (

         <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <CameraComponent />
                <Body>
                  {this.state.userName ?
                    <Text>{this.state.userName}</Text>
                    : null
                  }
                  {this.state.lastName ?
                    <Text note>{this.state.lastName}</Text>
                    : null
                  }
                </Body>
              </Left>
            </CardItem>
          </Card>

        </Content>
        <FooterNav></FooterNav>
      </Container>
    );
  }
}
