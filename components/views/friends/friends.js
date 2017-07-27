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
  Text,
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Header, Form, Segment, Item, Separator, Input, Label, Button,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, List, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import HideableView from 'react-native-hideable-view';

var bools = [true,false,true]

export default class Profile extends Component {

  static navigationOptions = {
    title: "Friends",
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  }

   constructor(props) {
       super(props);
       this.state = {
         uidCurrentUser: '',
         uid: '',
         inputSearch: '',
         users: [],
         btnText: 'Seguir',
         txt: '',
       }
    }

    search(text){
      if(text != ''){
        let ref = getDatabase().ref("/users")
        userList = (ref.orderByChild("nickname").startAt(text).endAt(text+'\uf8ff'))
        var that = this
        userList.on('value', (snap) => {
            var users = [];
            AsyncStorage.getItem("user").then((value) => {
                      snap.forEach((child) => {
                          let checkRepeat = getDatabase().ref('users/'+value+'/follows/').orderByChild("uid").equalTo(child.key);
                          checkRepeat.once('value', function(snapshot) {
                              var f = false
                              if(snapshot.exists() == false){
                                  f = true
                              }/*If does not exists*/
                              if(child.key != value){
                                users.push({
                                  id: child.key,
                                  nickname: child.val().nickname,
                                  name: child.val().name,
                                  lastName: child.val().lastName,
                                  url: child.val().url,
                                  foll: f,
                                });//users.push
                              }//if nick diff from current
                              that.setState({
                                  users: users,
                                  uidCurrentUser: value,
                                  txt: text,
                              })//setState
                          })//checkRepeat.once
                      });//snap.forEach
           })//AsyncStorage
      })//userList.on
      }/*if text has content*/else{
        this.setState({
          users: [],
        })
      }//else text has no content
    }//search

    follow(i){
      var that = this.state;
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser+'/follows/').orderByChild("uid").equalTo(that.users[i].id);
      checkRepeat.once('value', function(snapshot) {
        if(snapshot.exists() == false){
            getDatabase().ref().child('users/'+that.uidCurrentUser+'/follows/').push({
              uid: that.users[i].id,
              nickname: that.users[i].nickname,
            });
        }
      })//checkRepeat.once
      this.search(that.txt)
    }

    unfollow(i){
      var that = this.state;
      let ref = getDatabase().ref('/users/'+that.uidCurrentUser+'/follows/')
      followList = (ref.orderByChild("uid").equalTo(that.users[i].id))
      followList.on('value', (snap) => {
          var follows = [];
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
      })
      this.search(that.txt)
    }

  render() {
    const { navigate } = this.props.navigation;

    let listTable = this.state.users.map((u,i) => {
      return (
                    <ListItem>
                          <Thumbnail
                            small
                            source={{uri: u.url}}
                          />
                        <Text style={styles.nick}>{u.nickname}</Text>
                        <Text>{u.name} {u.lastName}</Text>
                        <HideableView visible={u.foll} removeWhenHidden={true} duration={100}>
                            <Button light onPress={() => this.follow(i)}>
                              <Text>{this.state.btnText+"    "}</Text>
                              <Icon name='person-add' />
                            </Button>
                        </HideableView>
                        <HideableView visible={!u.foll} removeWhenHidden={true} duration={100}>
                            <Button light onPress={() => this.unfollow(i)}>
                              <Text>Unfollow</Text>
                              <Icon name='person-add' />
                            </Button>
                        </HideableView>
                    </ListItem>
            )
      });

    return (
          <Container>
              <Content>
                    <Header style={{backgroundColor: 'white'}} searchBar rounded>
                          <Item>
                            <Icon name="search" />
                            <Input placeholder="Search"
                                   maxLength = {20}
                                   onChangeText={(text) => this.search(text)}
                            />
                            <Icon name="people" />
                          </Item>
                          <Button transparent>
                            <Text>Search</Text>
                          </Button>
                    </Header>
                    <Body>
                      <List>
                          {listTable}
                      </List>
                    </Body>
                </Content>
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
  center: {
      alignItems: 'center',
      flexDirection: 'row',
  },
  privateInfo: {
    paddingTop: 15,
  },
  title: {
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  nick: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000000',
    padding: 15,
  },
  diary: {
    fontStyle: 'italic',
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold',
  },
  description: {
    fontStyle: 'italic',
    textAlign: 'justify',
    fontSize: 14,
    textDecorationStyle: 'solid',
    color: '#000000',
    paddingLeft: 5,
  }
});
