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
import Moment from 'moment';
import { createNotification } from '../../common/notification';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

let diarys = [{id: '', name: '', description: '', url: ''}]
let follows = [{id: '', nickname: '', name: '', lastName: '', url: ''}]
let followers = [{id: '', nickname: '', name: '', lastName: '', url: ''}]

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
           showPig: false,
           isMe: false,
           date: new Date().toLocaleDateString(),
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
            Helper.getDairysByUserGuest(this.state.uid, (d) => {
             this.setState({
                 diarys: d.reverse(),
              })
              if(d.length === 0){
                  this.setState({
                    showPig: true,
                   })
              }else{
                this.setState({
                    showPig: false,
                 })
              }
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
       alert(strings.somethingGoesWrong +" "+ error)
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
            createNotification(that.uid, that.uidCurrentUser, "follow", Moment(new Date()).format("YYYY-MM-DD"),"","");

      })
      this.setState({
        foll: !this.state.foll,
        unfoll: !this.state.unfoll
      })
      this.showButton.bind(this)
      MessageBarManager.registerMessageBar(this.refs.alert);
      MessageBarManager.showAlert({
        title: strings.nowYouFollow +" "+ that.nickname,
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
        title: strings.nowYouUnfollow +" "+ that.nickname,
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
                          style={{width: 150, height: 200, borderStyle: 'solid', borderWidth: 2, borderColor: '#41BEB6', }}
                          source={{uri: this.state.url}}
                        />
                        <View style={styles.center}>
                            <Text style={styles.nick}>{this.state.nickname}</Text>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.fullname}>{this.state.userName} {this.state.lastName}</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => navigate('follows', {follows:this.state.follows})} style={styles.column, styles.center}>
                                        <Text style={styles.number}> { this.state.follows.length } </Text>
                                        <Text style={styles.follow}> {strings.following} </Text>
                                    </TouchableOpacity>
                                    <View style={styles.column, styles.center}>
                                        <Text onPress={() => navigate('followers', {followers:this.state.followers})} style={styles.number}> { this.state.followers.length } </Text>
                                        <Text style={styles.follow}> {strings.followers} </Text>
                                    </View>
                                </View>
                        <HideableView visible={this.state.foll} removeWhenHidden={true} duration={100}>
                                <Button light onPress={() => this.follow()} style={{width: (Dimensions.get('window').width)/1.8}}>
                                    <Text style={styles.center}>{strings.follow}</Text>
                                    <Icon name='add-circle-outline' />
                                </Button>
                        </HideableView>
                        <HideableView visible={this.state.unfoll} removeWhenHidden={true} duration={100}>
                            <Button light onPress={() => this.unfollow()} style={{width: (Dimensions.get('window').width)/1.8}}>
                                <Text style={styles.center}>{strings.unfollow}</Text>
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
               <Card>
                     <HideableView visible={this.state.showPig} removeWhenHidden={true} duration={100} style={styles.center}>
                        <Text style={styles.message}>{strings.thisUserHasNoDiaries}</Text>
                        <Text style={styles.message}>{strings.nothingToSeeHere}</Text>
                        <TouchableOpacity>
                          <Image
                             style={{width: (Dimensions.get('window').width)/1.2, height: 360}}
                             source={require('../../common/pigs/EmptyVisitProfile.png')} />
                       </TouchableOpacity>
                     </HideableView>
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
    fontSize: 18,
    color: '#000000',
  },
  fullname: {
    fontStyle: 'italic',
    fontSize: 20,
    color: '#000000',
    paddingLeft: 45,
    paddingRight: 10,
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
  },
  message: {
    fontStyle: 'italic',
    textAlign: 'justify',
    fontSize: 18,
    textDecorationStyle: 'solid',
    color: '#000000',
    paddingLeft: 20,
  },
});
