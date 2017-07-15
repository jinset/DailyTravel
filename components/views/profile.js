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
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Segment, Item, Input, Label, Button,Text,Body, Right, Switch, Icon, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../common/local_strings.js';
import { getDatabase } from '../common/database';
import FooterNav from  '../common/footerNav.js';
import CameraComponent from './CameraComponent';
import Helper from '../common/helper';
import * as firebase from 'firebase';

let diarys = [{id: null, name: null, description: null, url: null}]

 export default class Profile extends Component {

   constructor(props) {
       super(props);
       this.state = {
         uid: '',
         userName: '',
         lastName: '',
         diarys: diarys,
       }
    }

   static navigationOptions = {
    header: null,
    title: null,
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
       Helper.getDairysByUser(user.uid, (d) => {
        this.setState({
            diarys: d,
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
    let listTable = this.state.diarys.map((d,i) => {
        return (
                <ScrollView>
                    <CardItem key={i}>
                        <Body>
                            <Text>{d.name} </Text>
                            <Text>{d.description} </Text>
                            <Left>
                                <Image
                                  source={{uri: d.url}}
                                  style={{height: 300, width: Dimensions.get('window').width}}
                                />
                            </Left>
                        </Body>
                    </CardItem>
                </ScrollView>
              )
      });

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
                    <Button light small>
                        <Text>Editar Perfil</Text>
                    </Button>
                  </Left>
                </CardItem>
              </Card>
              <Card>
                    {listTable}
               </Card>

          </Content>
            <FooterNav></FooterNav>
          </Container>
    );
  }
}

const styles = StyleSheet.create({
  line1: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
