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
import { Container, Content, Form, Segment, Item, Separator, Input, Label, Button,Fab,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import baseStyles from '../../style/baseStyles.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraProfileComponent from '../cameraComponent/CameraProfileComponent';
import Helper from './helper';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import HideableView from 'react-native-hideable-view';

let diarys = [{id: null, name: null, description: null, url: null}]
let follows = [{id: null, nickname: null, name: null, lastName: null, url: null}]
let followers = [{id: null, nickname: null, name: null, lastName: null, url: null}]

export default class Profile extends Component {

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor(props) {
       super(props);
       console.disableYellowBox = true;
       this.state = {
         uid: '',
         userName: '',
         lastName: '',
         email: '',
         nickname: '',
         imagePath: '',
         birthday: '',
         diarys: diarys,
         followers: followers,
         follows: follows,
         showPig: false,
       }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
    static navigationOptions = {
      title: strings.profile,
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentDidMount(){
     try{
       var that = this;
       AsyncStorage.getItem("user").then((value) => {
             this.setState({
               uid: value
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
                imagePath: url,
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
       })
     } catch(error){
       alert("error: " + error)
     }
   }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// Follow /////////////////////////////////////////////////////////////
       follow(){
         var that = this.state;
         var tthat = this;
         let checkRepeat = getDatabase().ref('users/'+that.uid+'/follows/').orderByChild("uid").equalTo(that.uid);
         checkRepeat.once('value', function(snapshot) {
           if(snapshot.exists() == false){
               getDatabase().ref().child('users/'+that.uid+'/follows/').push({
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////// Add Followers ///////////////////////////////////////////////////////
       addFollowers(){
         var that = this.state;
         let checkRepeat = getDatabase().ref('users/'+that.uid);
         checkRepeat.once('value', function(snapshot) {
               getDatabase().ref().child('users/'+that.uid+'/followers/').push({
                 uid: that.uidCurrentUser,
                 nickname: snapshot.child("nickname").val(),
                 name: snapshot.child("name").val(),
                 lastName: snapshot.child("lastName").val(),
                 url: snapshot.child("url").val(),
               });
         })
       }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////// Unfollow /////////////////////////////////////////////////////////////
       unfollow(){
         var that = this.state;
         var tthat = this;
         let ref = getDatabase().ref('/users/'+that.uid+'/follows/')
         followList = (ref.orderByChild("uid").equalTo(that.uid))
         followList.on('value', (snap) => {
             snap.forEach((child) => {
                 ref.child(child.key).remove();
             });
             tthat.removeFollowers()
         })
       }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////// Remove Followers //////////////////////////////////////////////////////
       removeFollowers(){
         var that = this.state;
         let ref = getDatabase().ref('/users/'+that.uid+'/followers/')
         followersList = (ref.orderByChild("uid").equalTo(that.uid))
         followersList.on('value', (snap) => {
             snap.forEach((child) => {
                 ref.child(child.key).remove();
             });
         })
       }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {

    const { navigate } = this.props.navigation;

    let listTable = this.state.diarys.map((d,i) => {
        return (
                <ScrollView>
                    <CardItem key={i}>
                      <Body>

                          <View style={styles.row}>

                              <Thumbnail
                                small
                                source={{uri: this.state.imagePath}}
                              />
                              <TouchableHighlight style={{alignSelf: 'stretch', flex: 1}} onPress={() => navigate('DairyView', {diaryKey:d.id})}>
                                <View style={styles.center}>
                                    <Text style={styles.diary}>{"    " +d.name} </Text>
                                </View>
                              </TouchableHighlight>
                              <Right>
                                  <Icon active name='more-vert' />
                              </Right>
                          </View>
                          <TouchableHighlight style={{alignSelf: 'stretch', flex: 1}} onPress={() => navigate('DairyView', {diaryKey:d.id})}>
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
                        <CameraProfileComponent />
                          <View style={styles.center}>
                              <Text style={styles.nick}>{this.state.nickname}</Text>
                          </View>
                        </View>
                        <View style={styles.column}>
                          <Text style={styles.fullname}>{this.state.userName} {this.state.lastName}</Text>
                          <View style={styles.row}>
                              <TouchableOpacity onPress={() => navigate('follows', {follows:this.state.follows})} style={styles.column, styles.center}>
                                  <Text style={styles.number}> { this.state.follows.length } </Text>
                                  <Text style={styles.follow}> {"Seguidos"} </Text>
                              </TouchableOpacity>
                              <View style={styles.column, styles.center}>
                                  <Text onPress={() => navigate('followers', {followers:this.state.followers})} style={styles.number}> { this.state.followers.length } </Text>
                                  <Text style={styles.follow}> {"Seguidores"} </Text>
                              </View>
                          </View>
                    </View>
                 </Left>
                    <Button transparent small
                            onPress={()=>navigate('editProfile', {uid: this.state.uid,
                                                                  nickname: this.state.nickname,
                                                                  userName: this.state.userName,
                                                                  lastName: this.state.lastName,
                                                                  email: this.state.email,
                                                                  birthday: this.state.birthday,
                                                                })}>
                        <Icon active name='mode-edit' />
                    </Button>

                </CardItem>
              </Card>
                  <Card>
                        {listTable}
                  </Card>
              <Card>
                    <HideableView visible={this.state.showPig} removeWhenHidden={true} duration={100} style={styles.center}>

                       <Text style={styles.message}>{"Yo aparezco cuando no tienes diarios"}</Text>
                       <Text style={styles.message}>{"Tocame para crear uno"}</Text>
                       <TouchableOpacity onPress={()=>navigate('newDiary')}>
                         <Image
                            style={{width: (Dimensions.get('window').width)/1.2, height: 360}}
                            source={require('./ProfilePig.jpg')} />
                      </TouchableOpacity>
                    </HideableView>
               </Card>
          </Content>
              <View>
           <Fab
             active='false'
             direction="up"
             containerStyle={{ }}
             style={{  backgroundColor:'#41BEB6'}}
             position="bottomRight"
             onPress={()=> navigate('newDiary')}>
             <Icon color='white' name="library-books" />
           </Fab>
         </View>
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
  message: {
    fontStyle: 'italic',
    textAlign: 'justify',
    fontSize: 18,
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
  redCard: {
    padding: 20,
    backgroundColor: '#000000',
  }
});
