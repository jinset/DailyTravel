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
import {  Container, Content, Card, CardItem, Thumbnail,  Button, Left,Right, Body, Spinner,View,Fab, List, Text, SwipeRow, ListItem} from 'native-base';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import { createNotification } from '../../common/notification';
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
       showSpinnerTop:false,
       idUser: "",
       currentPageIndex : 1,
       refreshing: false,
       isConnected: true,
     };
   }

    static navigationOptions = {
        title: strings.notifications,
        headerStyle: {height: 50 },
        headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    }
    _onRefresh() {
       this.setState({refreshing: true});
       this.loadRefreshing().then(() => {
         this.setState({refreshing: false});
       });
     }

     handleOnPress = (idDiary, name, key) => {
       this.dialogbox.confirm({
           content: strings.acceptInvitation + " " + name + '?',
           ok: {
               callback: () => {
                   this.updateNotification(key);
                   this.updateUserDiary(idDiary);
                   this._onRefresh();
               },
           },
       });
     }

     updateNotification(key){
       getDatabase().ref().child('notifications/'+ this.state.idUser + '/' + key).update({
         status:true
       })
     }

     updateUserDiary(idDiary){
       getDatabase().ref().child('userDiary/'+ this.state.idUser + '-' + idDiary).update({
         invitationStatus:true
       })
     }

    /*
      Obtiene las 10 primeras notificaciones
     */
    async getNotifications(idUser, current) {
      return new Promise((resolve, reject) => {
        var pageSize = current * 10;
        var url = getDatabase().ref('notifications/'+ idUser).limitToLast(pageSize);
        url.on('value', (snap) => {
          var notifications = [];
          snap.forEach((child) => {
            notifications.push({
            _key: child.key,
            status: child.val().status,
            type: child.val().type,
            userIdGet: child.val().userIdGet,
            date: child.val().date,
            diaryId: child.val().diaryId,
            diaryName: child.val().diaryName
            })
          });
          resolve(notifications.reverse())
        })
      })
    }

    async getUser(dataUser) {
      try {
        return new Promise((resolve, reject) => {
          console.log(dataUser);
            var users = [];
            var ref = getDatabase().ref("users/" + dataUser.userIdGet);
            ref.once("value", (snapshot) => {
              var val = snapshot.val();
              console.log(val);
              users = {
                _key: dataUser._key,
                status: dataUser.status,
                type: dataUser.type,
                userIdGet: dataUser.userIdGet,
                date: dataUser.date,
                diaryId: dataUser.diaryId,
                diaryName: dataUser.diaryName,
                userNick: val.nickname,
                photoUser: val.url
              }
              console.log(users);
              resolve(users);
            })
        });
      } catch (e) {
        console.log(e);
      } finally {

      }

    };
    async loadNotifications() {
      try {
        let notificationsArray = [];
        this.setState({refreshing: true});

        var idUser = "";
        await AsyncStorage.getItem("user").then((value) => {
          this.state.idUser = value;
          idUser = value;
        })
        let array = await this.getNotifications(idUser,this.state.currentPageIndex );
        for (var i in array) {
          await this.getUser(array[i]).then(data => {
            notificationsArray.push(data)
          });
        }
        /*Carga el home en el dataSource*/
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(notificationsArray)
        });
        /*Desaparece el loading*/
        this.setState({refreshing: false});

      } catch (error) {
        console.log(error.message);
      }

    }
    async loadRefreshing() {
      try {
        let notificationsArray = [];
         var current = this.state.currentPageIndex;
         current = current +1;
         this.setState({
           currentPageIndex: current
         });
        let array = await this.getNotifications(this.state.idUser,current );
        for (var i in array) {
          await this.getUser(array[i]).then(data => {
            notificationsArray.push(data)
          });
        }
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(notificationsArray)
        });
      } catch (error) {
        console.log(error.message);
      }

    }
  async componentWillMount() {
    NetInfo.isConnected.fetch().done(isConnected => {
        if (isConnected === true) {
          this.loadNotifications();
        }else{
          this.loadNotifications();
            MessageBarManager.registerMessageBar(this.refs.alert);
            MessageBarManager.showAlert({
              title: "error",
              message: strings.noInternet,
              alertType: 'info',
              position: 'bottom',
              duration: 10000,
              stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
            });
        }
    });

  }

  _renderItem(item) {
    const { navigate } = this.props.navigation;
    return (
      <View key={item._key}>
      <ListItem>
        <Left>
          <TouchableHighlight onPress={() => navigate('visitProfile', {uid:item.userIdGet})}>
            <Thumbnail source={{uri: item.photoUser}} />
          </TouchableHighlight>
        <Body>
        <View>
        {(() => {
          switch (item.type) {
            case "follow": return <Text>{strings.theUser} {item.userNick} {strings.hasFollowed}</Text>;
            case "invitation":
            switch (item.status) {
              case false: return <TouchableHighlight onPress={() => this.handleOnPress(item.diaryId, item.diaryName, item._key)}>
                  <Text>{strings.theUser} {item.userNick} {strings.sendInvitation} {item.diaryName}, {strings.touchAccept} </Text>
              </TouchableHighlight>;

              case true: return <Text>{strings.acceptAlreadyInvitation} {item.diaryName}</Text>
            }
          }
        })()}
        </View>
          <Text note>{item.date}</Text>
        </Body>
        </Left>
      </ListItem>
      </View>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <HideableView visible={this.state.showSpinnerTop} removeWhenHidden={true} >
          <Spinner />
        </HideableView>
         <Content contentContainerStyle={{flex: 1}}>
           <ListView
           refreshControl={
             <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                tintColor="#41BEB6"
                colors={['#41BEB6',"#9A9DA4"]}
                progressBackgroundColor="#FCFAFA"
              />
            }
             dataSource={this.state.dataSource}
             renderRow={this._renderItem.bind(this)}
             enableEmptySections={true}
             >
           </ListView>
           <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
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
         <MessageBarAlert ref="alert"/>

       </Container>
    );
  }
}
