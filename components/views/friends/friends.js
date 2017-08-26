import {
  AppRegistry,
  TextInput,
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
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Header, Form, Segment, Item,View,Fab, Separator, Input, Label, Button,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, List, ListItem,Spinner,Grid,Col} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import Helper from './helper';
import HideableView from 'react-native-hideable-view';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import { createNotification } from '../../common/notification';
import Moment from 'moment';

export default class Profile extends Component {

  static navigationOptions = {
    title: strings.friends,
    headerStyle: {height: 50 },
    headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    header: null,
  }

   constructor(props) {
       super(props);
       this.state = {
        dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        showSpinner:false,
        idUser: "",
         uidCurrentUser: '',
         uid: '',
         inputSearch: '',
         users: [],
         follows: [],
         txt: '',
         showSuggest: false
       }
    }

///////////////////////////////////////// Component Will Mount ///////////////////////////////////////////////////
async componentWillMount(){
  try{
    this.searchNewFriends();

    var that = this;
    AsyncStorage.getItem("user").then((value) => {
          this.setState({
            uid: value,
            uidCurrentUser: value
          })
          Helper.getFollows(this.state.uid, (f) => {
            this.setState({
              follows: f,
              users: f,
            })
          })
    })
    this.search('')
  } catch(error){
    alert("error: " + error)
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getFollows(){
   this.searchNewFriends();
    var that = this;
    Helper.getFollows(this.state.uid, (f) => {
          this.setState({
            follows: f,
            users: f,
          })
        })
}

/////////////////////////////////////////// Search ///////////////////////////////////////////////////////
    search(text){
      if(text != ''){
        let ref = getDatabase().ref("/users")
        userList = (ref.orderByChild("nickname").startAt(text).endAt(text+'\uf8ff'))
        var that = this
        userList.once('value', (snap) => {
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
        Helper.getFollows(this.state.uidCurrentUser, (f) => {
              this.setState({
                follows: f,
                users: f,
              })
            })
      }//else text has no content
    }//search
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Follow /////////////////////////////////////////////////////////////
    follow(i){
      var that = this.state;
      var tthat = this;
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser+'/follows/').orderByChild("uid").equalTo(that.users[i].id);
      checkRepeat.once('value', function(snapshot) {
        if(snapshot.exists() == false){
            getDatabase().ref().child('users/'+that.uidCurrentUser+'/follows/').push({
              uid: that.users[i].id,
              nickname: that.users[i].nickname,
              name: that.users[i].name,
              lastName: that.users[i].lastName,
              url: that.users[i].url,
            });
            tthat.addFollowers(i)
        }
      })//checkRepeat.once
      createNotification(that.uid, that.uidCurrentUser, "follow", Moment(new Date()).format("YYYY-MM-DD"),"","");
      this.searchNewFriends();
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Add Followers ///////////////////////////////////////////////////////
    addFollowers(i){
      var that = this.state;
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser);
      checkRepeat.once('value', function(snapshot) {
            getDatabase().ref().child('users/'+that.users[i].id+'/followers/').push({
              uid: that.uidCurrentUser,
              nickname: snapshot.child("nickname").val(),
              name: snapshot.child("name").val(),
              lastName: snapshot.child("lastName").val(),
              url: snapshot.child("url").val(),
            });
      })

      this.search(that.txt)
      MessageBarManager.registerMessageBar(this.refs.alert);
      MessageBarManager.showAlert({
        title: strings.nowYouFollow + that.users[i].nickname,
        message: that.users[i].name + " " + that.users[i].lastName ,
        avatar: that.users[i].url,
        alertType: 'info',
        position: 'bottom',
        duration: 6000,
        stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
      });
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Unfollow /////////////////////////////////////////////////////////////
    unfollow(i){
      var that = this.state;
      var tthat = this;
      let ref = getDatabase().ref('/users/'+that.uidCurrentUser+'/follows/')
      followList = (ref.orderByChild("uid").equalTo(that.users[i].id))
      followList.once('value', (snap) => {
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
          tthat.removeFollowers(i)
      })
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Remove Followers //////////////////////////////////////////////////////
    removeFollowers(i){
         this.searchNewFriends();
      var that = this.state;
      let ref = getDatabase().ref('/users/'+that.users[i].id+'/followers/')
      followersList = (ref.orderByChild("uid").equalTo(that.uidCurrentUser))
      followersList.once('value', (snap) => {
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
      })
      this.search(that.txt)
      MessageBarManager.registerMessageBar(this.refs.alert);
      MessageBarManager.showAlert({
        title: strings.nowYouUnfollow + that.users[i].nickname,
        message: that.users[i].name + " " + that.users[i].lastName ,
         avatar: that.users[i].url,
         alertType: 'info',
         position: 'bottom',
         duration: 6000,
         stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
      });
    }
//////////////////////////////////////////////////////////////suggest friends stuff  ///////////////////////////////////////
    async searchSuggestFriends(arrayFriends) {
      return new Promise((resolve, reject) => {
        var url = getDatabase().ref('users');
        url.on('value', (snap) => {
          var newFriends = [];
          snap.forEach((child) => {
            if (!arrayFriends.includes(child.key) && child.val().status == 'act' &&  newFriends.length < 5) {
              newFriends.push({
                _key: child.key,
                nickname: child.val().nickname,
                url: child.val().url
              })
            }
          });
          resolve(newFriends)
        })
      })
    }
///////////////////////////////////////////////////////////// //////////////////////////////////
    async getArrayFriends(idUser) {
      try {
        return new Promise((resolve, reject) => {
            var friends = [];
            array = [];
            friends.push(idUser);
            var ref = getDatabase().ref("users/" + idUser);
            ref.once("value", (snapshot) => {
              var val = snapshot.val();
              console.log(val);
              for (var i in val.follows) {
                array.push(val.follows[i].uid);
              }
              friends = friends.concat(array);
              resolve(friends);
            })
        });
      } catch (e) {
        console.log(e);
      } finally {

      }

    };
    async searchNewFriends() {
      try {
        this.setState({
          showSpinner:true,
          showSuggest: false
        })
        let suggestNewFriendsArray = [];
        var idUser = "";
        await AsyncStorage.getItem("user").then((value) => {
          this.state.idUser = value;
          idUser = value;
        })
        let arrayFriends = await this.getArrayFriends(idUser);
        suggestNewFriendsArray = await this.searchSuggestFriends(arrayFriends);

        /*Carga el home en el dataSource*/
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(suggestNewFriendsArray)
        });
        /*Desaparece el loading*/
        this.setState({
          showSpinner:false,
          showSuggest: true
        })
      } catch (error) {
        console.log(error.message);
      }

    }

/////////////////////////////////////////Render Item ////////////////////////////////////////
     _renderItem(item) {
    const { navigate } = this.props.navigation;
    return (
      <View key={item._key} style={{margin:10}}>
        <TouchableHighlight onPress={() => navigate('visitProfile', {uid:item._key})}>
          <Thumbnail large source={{uri: item.url}} />
        </TouchableHighlight>
        <Text style={{textAlign: 'center'}}>{item.nickname}</Text>
      </View>
    );
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { navigate } = this.props.navigation;

    let listTable = this.state.users.map((u,i) => {
      return (
                    <ListItem>
                        <TouchableOpacity onPress={() => navigate('visitProfile', {uid:u.id})} style={styles.row}>
                          <Left>
                              <Thumbnail
                                large
                                source={{uri: u.url}}
                              />
                          </Left>
                          <Body>
                              <View style={{paddingTop: 20}}>
                                  <Text style={styles.nick}>{u.nickname}</Text>
                              </View>
                          </Body>

                        <HideableView visible={u.foll} removeWhenHidden={true} duration={100}>
                            <Right>
                              <View style={{paddingTop: 15}}>
                                <Button light onPress={() => this.follow(i)} style={{width: 120}}>
                                  <Text>{strings.follow}</Text>
                                  <Icon name='add-circle-outline' />
                                </Button>
                              </View>
                            </Right>
                        </HideableView>
                        <HideableView visible={!u.foll} removeWhenHidden={true} duration={100}>
                          <Right>
                            <View style={{paddingTop: 15}}>
                              <Button light onPress={() => this.unfollow(i)} style={{width: 120}}>
                                <Text>{strings.unfollow}</Text>
                                <Icon name='remove-circle-outline' />
                              </Button>
                            </View>
                          </Right>
                        </HideableView>
                        </TouchableOpacity>
                    </ListItem>
            )
      });

    return (
          <Container>
              <Content>
                    <Header style={{backgroundColor: 'white'}} searchBar rounded>
                          <Item>
                            <Icon name="search" />
                            <Input placeholder={strings.search}
                                   maxLength = {20}
                                   onChangeText={(text) => this.search(text)}
                            />
                            <Icon name="people" />
                          </Item>
                          <Button transparent>
                            <Text>{strings.search}</Text>
                          </Button>
                    </Header>
                    <Body>
                      <List>
                          {listTable}
                      </List>
                    </Body>

                </Content>
                <View>
                 <Text style={{textAlign: 'center',paddingTop:8, paddingBottom:8, backgroundColor: '#fff'}}>{strings.friendsSuggest}</Text>
                  <HideableView visible={this.state.showSuggest} removeWhenHidden={true} >
                <ListView
                  horizontal= {true}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderItem.bind(this)}>
                </ListView>
                </HideableView>
                <HideableView visible={this.state.showSpinner} removeWhenHidden={true} >
                  <Spinner />
                </HideableView>
                </View>
                <MessageBarAlert ref="alert"/>
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
    padding: 1,
  },
  name: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#000000',
    padding: 1,
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
