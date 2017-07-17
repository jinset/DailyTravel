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
import { Container, Content, Form, Segment, Item, Input, Label, Button,Text,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import Helper from './helper';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';

let diarys = [{id: null, name: null, description: null, url: null}]

export default class Profile extends Component {

   constructor(props) {
       super(props);
       this.state = {
         uid: '',
         userName: '',
         lastName: '',
         email: '',
         nickname: '',
         diarys: diarys,
       }
    }

   static navigationOptions = {
    header: null,
    title: null,
   };

   async componentDidMount(){
     try{
       //let user = await firebase.auth().currentUser
       Helper.getUserName("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", (name) => {
         this.setState({
           userName: name,
         })
       })
       Helper.getUserLastName("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", (lastname) => {
         this.setState({
           lastName: lastname,
         })
       })
       Helper.getUserEmail("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", (email) => {
         this.setState({
           email: email,
         })
       })
       Helper.getUserNickname("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", (nickname) => {
        this.setState({
            nickname: nickname,
         })
      })
       Helper.getDairysByUser("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", (d) => {
        this.setState({
            diarys: d,
         })
       })
       this.setState({
          uid: "0OzwjYU9g4MRuxwQYlH1UQcKcyC3",
       })
     } catch(error){
       alert("error: " + error)
     }
   }

  render() {

    const { navigate } = this.props.navigation;

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
              <Card fixed>
                <CardItem>
                  <Left>
                    <View style={styles.column}>
                        <CameraComponent />
                            {this.state.nickname ?
                              <Text >{this.state.nickname}</Text>
                              : null
                            }
                            {/*{this.state.userName && this.state.lastName ?
                              <Text>{this.state.userName} {this.state.lastName}</Text>
                              : null
                            } */}
                    </View>
                    <Body>
                    </Body>
                    <Button transparent small
                            onPress={()=>navigate('editProfile', {userName: this.state.userName,
                                                                  lastName: this.state.lastName,
                                                                  email: this.state.email,
                                                                  nickname: this.state.nickname,
                                                                })}>
                        <Icon active name='mode-edit' />
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
  column: {
    flexDirection: 'column',
  }
});
