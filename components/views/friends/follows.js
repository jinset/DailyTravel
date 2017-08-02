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
import { Container, Content, Header, Form, Segment, Item, Separator, Input, Label, Button,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, List, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import HideableView from 'react-native-hideable-view';

export default class Follows extends Component {

////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
  static navigationOptions = {
    title: "Follows",
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor(props) {
       super(props);
       this.state = {
         uidCurrentUser: '',
         uid: '',
         inputSearch: '',
         users: [],
         follList: [],
         btnText: 'Seguir',
         txt: '',
         isMe: [],
       }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Component Did Mount //////////////////////////////////////////////////
    async componentDidMount(){
      const { params } = this.props.navigation.state;
      var that = this
      var tthat = this.state
      var wat = params.follows
      var flist = [];
      var isMeList = [];
      AsyncStorage.getItem("user").then((value) => {
                    wat.forEach((child, i) => {
                        let checkRepeat = getDatabase().ref('users/'+value+'/follows/').orderByChild("uid").equalTo(child.id);
                        checkRepeat.once('value', function(snapshot) {
                            var f = false
                            if(snapshot.exists() == false){
                                f = true
                            }/*If does not exists*/
                            if(child.id == value){
                              isMeList.push(true)
                            }else{
                              isMeList.push(false)
                            }
                            flist.push(f)
                            that.setState({
                              uidCurrentUser: value,
                              follList: flist,
                              isMe: isMeList,
                            })
                        })//checkRepeat.once
                    });//snap.forEach
      })//AsyncStorage
      that.setState({
        follList: flist.reverse(),
        isMe: isMeList.reverse(),
      })
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Follow /////////////////////////////////////////////////////////////
    follow(i){
      const { params } = this.props.navigation.state;
      var that = this.state;
      var tthat = this;
      var wat = params.follows
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser+'/follows/').orderByChild("uid").equalTo(wat[i].id);
      checkRepeat.once('value', function(snapshot) {
        if(snapshot.exists() == false){
            getDatabase().ref().child('users/'+that.uidCurrentUser+'/follows/').push({
              uid: wat[i].id,
              nickname: wat[i].nickname,
              name: wat[i].name,
              lastName: wat[i].lastName,
              url: wat[i].url,
            });
            tthat.addFollowers(i)
        }
      })//checkRepeat.once
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Add Followers ///////////////////////////////////////////////////////
    addFollowers(i){
      const { params } = this.props.navigation.state;
      var wat = params.follows
      var that = this.state;
      let checkRepeat = getDatabase().ref('users/'+that.uidCurrentUser);
      checkRepeat.once('value', function(snapshot) {
            getDatabase().ref().child('users/'+wat[i].id+'/followers/').push({
              uid: that.uidCurrentUser,
              nickname: snapshot.child("nickname").val(),
              name: snapshot.child("name").val(),
              lastName: snapshot.child("lastName").val(),
              url: snapshot.child("url").val(),
            });
      })
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Unfollow /////////////////////////////////////////////////////////////
    unfollow(i){
      const { params } = this.props.navigation.state;
      var wat = params.follows;
      var that = this.state;
      var tthat = this;
      let ref = getDatabase().ref('/users/'+that.uidCurrentUser+'/follows/')
      followList = (ref.orderByChild("uid").equalTo(wat[i].id))
      followList.on('value', (snap) => {
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
          tthat.removeFollowers(i)
      })
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Remove Followers //////////////////////////////////////////////////////
    removeFollowers(i){
      const { params } = this.props.navigation.state;
      var wat = params.follows;
      var that = this.state;
      let ref = getDatabase().ref('/users/'+wat[i].id+'/followers/')
      followersList = (ref.orderByChild("uid").equalTo(that.uidCurrentUser))
      followersList.on('value', (snap) => {
          snap.forEach((child) => {
              ref.child(child.key).remove();
          });
      })
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    var that = this.state
    let listTable = params.follows.map((u,i) => {
      return (
                    <ListItem>
                        <TouchableOpacity onPress={() => navigate('visitProfile', {uid:u.id})} style={styles.row}>
                          <Thumbnail
                            small
                            source={{uri: u.url}}
                          />
                        <Text style={styles.nick}>{u.nickname}</Text>
                        <Text style={styles.name}>{u.name} {u.lastName}</Text>
                        </TouchableOpacity>

                            <HideableView visible={that.follList[i]} removeWhenHidden={true} duration={100}>
                                <Button light onPress={() => this.follow(i)}>
                                  <Text>{this.state.btnText+"    "}</Text>
                                  <Icon name='add-circle-outline' />
                                </Button>
                            </HideableView>
                            <HideableView visible={!that.follList[i]} removeWhenHidden={true} duration={100}>
                                <Button light onPress={() => this.unfollow(i)}>
                                  <Text>Unfollow</Text>
                                  <Icon name='remove-circle-outline' />
                                </Button>
                            </HideableView>

                        <HideableView visible={that.isMe[i]} removeWhenHidden={true} duration={100}>
                              <Text>Tú</Text>
                              <Icon name='face' />
                        </HideableView>
                    </ListItem>
            )
      });

    return (
          <Container>
              <Content>
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
    padding: 10,
  },
  name: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#000000',
    padding: 10,
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
