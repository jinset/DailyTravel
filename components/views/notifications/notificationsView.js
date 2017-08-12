import {
  AppRegistry,
  Image,
  ListView,
  TouchableHighlight,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {  Container, Content, Card, CardItem, Thumbnail,  Button, Left,Right, Body, Spinner,View,Fab, List, Text, SwipeRow} from 'native-base';
import { ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import { createNotification } from '../../common/notification';
import HideableView from 'react-native-hideable-view';
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
       showSpinner:true,
       idUser: "",
       currentPageIndex : 1
     };
   }

    static navigationOptions = {
        title: strings.notifications,
        headerStyle: {height: 50 },
        headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    }
    /*
      Obtiene los diarios que su privacidad esten en falsos
     */
    async getNotifications(idUser, current) {
      return new Promise((resolve, reject) => {
        var pageSize = current * 10;
        var url = getDatabase().ref('notifications/'+ idUser).limitToLast(pageSize);
        url.on('value', (snap) => {
          var notifications = [];
          snap.forEach((child) => {
            notifications.push({
            _key: child.key
            // status: child.val().status,
            // type: child.val().type,
            // userIdGet: child.val().userIdGet,
            // userGet: child.val().userGet,
            // date: child.val().date
            })
          });
          resolve(notifications.reverse())
        })
      })
    }

  async componentWillMount() {
    try {
      this.setState({
         showSpinner: true
       });
      var idUser = "";
      await AsyncStorage.getItem("user").then((value) => {
        this.state.idUser = value;
        idUser = value;
      })
      console.log(
        "vamos al Array"
      );
      let array = await this.getNotifications(idUser,this.state.currentPageIndex );
      console.log(
        "Termina el Array"
      );
      /*Carga el home en el dataSource*/
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(array)
      });
      /*Desaparece el loading*/
     this.setState({
        showSpinner: false
      });
    } catch (error) {
      console.log(error.message);
    }

  }

  _renderItem(item) {
    const { navigate } = this.props.navigation;
    return (
              <List key={item._key}>
                    <ListItem avatar>
                      <Left>
                        <Thumbnail source={{uri: item.userGet.url}} />
                      </Left>
                      <Body>
                        <Text>{item.userGet.nickname}</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                      </Body>
                      <Right>
                        <Text note>{item.date}</Text>
                      </Right>
                    </ListItem>
              </List>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
         <Content>
           <ListView
             dataSource={this.state.dataSource}
             renderRow={this._renderItem.bind(this)}
             enableEmptySections={true}
             >
           </ListView>
           <HideableView visible={this.state.showSpinner} removeWhenHidden={true} >
              <Spinner />
           </HideableView>
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
