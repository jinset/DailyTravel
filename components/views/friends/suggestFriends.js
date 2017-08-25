import {
  AppRegistry,
  Image,
  ListView,
  TouchableHighlight,
  Dimensions,
  AsyncStorage,
  RefreshControl,
  NetInfo,
  StyleSheet
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {  Container, Content, Card, CardItem, Thumbnail,  Button, Left,Right, Body, Spinner,View,Fab, List, Text, SwipeRow, ListItem, Separator} from 'native-base';
import { Icon } from 'react-native-elements';
import strings from './local_strings.js';
import { getDatabase } from './database';
import HideableView from 'react-native-hideable-view';
import DialogBox from 'react-native-dialogbox';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

 export default class NotificationsView extends Component {

   constructor(props) {
     super(props);
     console.disableYellowBox = true;
     this.state = {
       dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2,
       }),
       showSpinner:false,
       idUser: "",
     };
   }
    static navigationOptions = {
     title: "",
     header: null
     }

    /*
     */
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

    async getArrayFriends(idUser) {
      try {
        return new Promise((resolve, reject) => {
            var friends = [];
            console.log("la cagada " + idUser);
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
          showSpinner:true
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
      console.log(suggestNewFriendsArray);
        /*Desaparece el loading*/
        this.setState({
          showSpinner:false
        })
      } catch (error) {
        console.log(error.message);
      }

    }

  async componentWillMount() {
       this.searchNewFriends();
    };

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


  render() {

    return (
      <View>
        <Text style={{textAlign: 'center',paddingTop:8, paddingBottom:8, backgroundColor: '#fff'}}>Recomendacion de amigos</Text>
        <ListView 
          horizontal= {true}
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}>
      </ListView>
      <HideableView visible={this.state.showSpinner} removeWhenHidden={true} >
          <Spinner />
        </HideableView>
       </View>
    );
  }
}
