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
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Segment, Item, Separator, Input, Label, Button,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import Helper from './helper';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import HideableView from 'react-native-hideable-view';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

let diarys = [{id: null, name: null, description: null, url: null}]
let follows = [{id: null, nickname: null, name: null, lastName: null, url: null}]
let followers = [{id: null, nickname: null, name: null, lastName: null, url: null}]

export default class EditProfile extends Component {

  //////////////////////////////// Constructor //////////////////////////////////////////////////////////////////
     constructor(props) {
         super(props);
         console.disableYellowBox = true;
         this.state = {
           uidCurrentUser: '',
           uid: '',
           userName: '',
           lastName: '',
           email: '',
           nickname: '',
           url: '',
           birthday: '',
           foll: '',
           unfoll: '',
           diarys: diarys,
           followers: followers,
           follows: follows,
           isMe: false,
         }
      }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Component Did Mount ///////////////////////////////////////////////////////////
    async componentDidMount(){
    const { params } = this.props.navigation.state;
     try{
       var that = this;
       AsyncStorage.getItem("user").then((value) => {
             if(value == params.uid){
               this.setState({ isMe: false })
             }else{
               this.setState({ isMe: true })
             }
             this.setState({
               uid: params.uid,
               uidCurrentUser: value
             })
             Helper.getUserName(this.state.uid, (name) => {
               this.setState({
                 userName: name,
               })
             })
             Helper.getUserNickname(this.state.uid, (nickname) => {
              this.setState({
                  nickname: nickname,
               })
            })
            Helper.getUserLastName(this.state.uid, (lastname) => {
              this.setState({
                lastName: lastname,
              })
            })
            Helper.getUserEmail(this.state.uid, (email) => {
              this.setState({
                email: email,
              })
            })
            Helper.getImageUrl(this.state.uid, (url) => {
              this.setState({
                url: url,
              })
            })
            Helper.getUserBirthDay(this.state.uid, (birthday) => {
              this.setState({
                birthday: birthday,
              })
            })
            Helper.getDairysByUser(this.state.uid, (d) => {
             this.setState({
                 diarys: d,
              })
            })
           Helper.getFollowers(this.state.uid, (f) => {
              this.setState({
                followers: f,
              })
            })
            Helper.getFollows(this.state.uid, (f) => {
              this.setState({
                follows: f,
              })
            })
            that.showButton()
       })
     } catch(error){
       alert("error: " + error)
     }
   }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////// Navigation Options ///////////////////////////////////////////////////////////////
    static navigationOptions = {
      title: strings.profile,
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Follow /////////////////////////////////////////////////////////////
    follow(){
      var that = this.state;
      var tthat = this;
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser+'/follows/').orderByChild("uid").equalTo(that.uid);
      checkRepeat.once('value', function(snapshot) {
        if(snapshot.exists() == false){
            getDatabase().ref().child('users/'+that.uidCurrentUser+'/follows/').push({
              uid: that.uid,
              nickname: that.nickname,
              name: that.userName,
              lastName: that.lastName,
              url: that.url,
            });
            tthat.addFollowers()
        }
      })//checkRepeat.once
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Add Followers ///////////////////////////////////////////////////////
    addFollowers(){
      var that = this.state;
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser);
      checkRepeat.once('value', function(snapshot) {
            getDatabase().ref().child('users/'+that.uid+'/followers/').push({
              uid: that.uidCurrentUser,
              nickname: snapshot.child("nickname").val(),
              name: snapshot.child("name").val(),
              lastName: snapshot.child("lastName").val(),
              url: snapshot.child("url").val(),
            });
      })
      this.setState({
        foll: !this.state.foll,
        unfoll: !this.state.unfoll
      })
      this.showButton.bind(this)
      MessageBarManager.registerMessageBar(this.refs.alert);
      MessageBarManager.showAlert({
        title: 'Ahora sigues a: ' + that.nickname,
        message: that.userName + " " + that.lastName ,
        avatar: that.url,
        alertType: 'info',
        position: 'bottom',
        duration: 6000,
        stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
      });
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Unfollow /////////////////////////////////////////////////////////////
    unfollow(){
      var that = this.state;
      var tthat = this;
      let ref = getDatabase().ref('/users/'+that.uidCurrentUser+'/follows/')
      followList = (ref.orderByChild("uid").equalTo(that.uid))
      followList.once('value', (snap) => {
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
          tthat.removeFollowers()
      })
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Remove Followers //////////////////////////////////////////////////////
    removeFollowers(){
      var that = this.state;
      let ref = getDatabase().ref('/users/'+that.uid+'/followers/')
      followersList = (ref.orderByChild("uid").equalTo(that.uidCurrentUser))
      followersList.once('value', (snap) => {
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
      })
      this.setState({
        foll: !this.state.foll,
        unfoll: !this.state.unfoll
      })
      this.showButton.bind(this)
      MessageBarManager.registerMessageBar(this.refs.alert);
      MessageBarManager.showAlert({
        title: 'Dejaste de seguir a: ' + that.nickname,
        message: that.userName + " " + that.lastName ,
         avatar: that.url,
         alertType: 'info',
         position: 'bottom',
         duration: 6000,
         stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
      });
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Show Button /////////////////////////////////////////////////////////
showButton(){
  var that = this.state
  var tthat = this
  AsyncStorage.getItem("user").then((value) => {
    let checkRepeat = getDatabase().ref('users/'+value+'/follows/').orderByChild("uid").equalTo(that.uid);
                checkRepeat.once('value', function(snapshot) {
                    var f = false
                    if(snapshot.exists() == false){
                        f = true
                    }
                    if(value == that.uid){
                      tthat.setState({
                        foll: false,
                        unfoll: false,
                      })//setState
                    }else{
                      tthat.setState({
                        foll: f,
                        unfoll: !f,
                      })//setState
                    }
                })//checkRepeat.once
  })//AsyncStorage
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    let listTable = this.state.diarys.map((d,i) => {
        return (
                <ScrollView>
                    <CardItem key={i}>
                      <Body>
                          <View style={styles.row}>
                              <Thumbnail
                                small
                                source={{uri: this.state.url}}
                              />
                              <TouchableHighlight style={{alignSelf: 'stretch', flex: 1}} onPress={() => navigate('fDairyView', {diaryKey:d.id})}>
                                <View style={styles.center}>
                                    <Text style={styles.diary}>{"    " +d.name} </Text>
                                </View>
                              </TouchableHighlight>
                              <Right>
                                  <Icon active name='more-vert' />
                              </Right>
                          </View>
                          <TouchableHighlight style={{alignSelf: 'stretch', flex: 1}} onPress={() => navigate('fDairyView', {diaryKey:d.id})}>
                            <Left>
                                <Image
                                  source={{uri: d.url}}
                                  style={{height: 300, width: Dimensions.get('window').width}}
                                />
                                <Text style={styles.description}> {d.description} </Text>
                           </Left>
                         </TouchableHighlight>
                        </Body>
                    </CardItem>
                    <Separator></Separator>
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
                        <Thumbnail
                          style={{width: 150, height: 200, borderStyle: 'solid', borderWidth: 2, borderColor: '#70041b', }}
                          source={{uri: this.state.url}}
                        />
                        <View style={styles.center}>
                            <Text style={styles.nick}>{this.state.nickname}</Text>
                        </View>
                    </View>
                    <View style={styles.column}>

                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => navigate('follows', {follows:this.state.follows})} style={styles.column, styles.center}>
                                        <Text style={styles.number}> { this.state.follows.length } </Text>
                                        <Text style={styles.follow}> {"Seguidos"} </Text>
                                    </TouchableOpacity>
                                    <View style={styles.column, styles.center}>
                                        <Text onPress={() => navigate('followers', {followers:this.state.followers})} style={styles.number}> { this.state.followers.length } </Text>
                                        <Text style={styles.follow}> {"Seguidores"} </Text>
                                    </View>
                                        {/*{this.state.userName && this.state.lastName ?
                                          <Text>{this.state.userName} {this.state.lastName}</Text>
                                          : null
                                        } */}
                                </View>
                        <HideableView visible={this.state.foll} removeWhenHidden={true} duration={100}>
                                <Button light onPress={() => this.follow()} style={{width: (Dimensions.get('window').width)/1.8}}>
                                    <Text style={styles.center}>{"Seguir"}</Text>
                                    <Icon name='add-circle-outline' />
                                </Button>
                        </HideableView>
                        <HideableView visible={this.state.unfoll} removeWhenHidden={true} duration={100}>
                            <Button light onPress={() => this.unfollow()} style={{width: (Dimensions.get('window').width)/1.8}}>
                                <Text style={styles.center}>Dejar de seguir</Text>
                                <Icon name='remove-circle-outline' />
                            </Button>
                        </HideableView>
                    </View>
                 </Left>
                </CardItem>
              </Card>
              <Card>
                    {listTable}
               </Card>
          </Content>
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
    paddingLeft: 20,
  },
  follow: {
    fontStyle: 'italic',
    textAlign: 'justify',
    fontSize: 15,
    textDecorationStyle: 'solid',
    color: '#000000',
    paddingLeft: 25,
    paddingRight: 10,
  },
  number: {
    fontStyle: 'italic',
    fontSize: 25,
    color: '#000000',
  }
});
