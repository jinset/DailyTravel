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
import {  Container, Content, Card, CardItem, Thumbnail, Text, Button, Left,Right, Body, Spinner,View,Fab,Drawer, ListItem} from 'native-base';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase, getAuth } from '../../common/database';
import HideableView from 'react-native-hideable-view';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


 export default class Home extends Component {

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
       showPig: false,
       fcm_token: ""
     };
   }

   static navigationOptions = {
     title: strings.home,
     headerStyle: {height: 50 },
     headerTitleStyle : {color:'#9A9DA4',fontSize:17},
     }


    _onRefresh() {
       this.setState({refreshing: true});
       this.loadRefreshing().then(() => {
         this.setState({refreshing: false});
       });
     }
  async getLogin(idUser) {
      return new Promise((resolve, reject) => {
        var ref = getDatabase().ref("users/" + idUser);
        ref.once("value").then(function(snapshot) {
          var val = snapshot.val();
          console.log(val);
          resolve(val);
        });
      })
    };

    /*
      Obtiene los diarios que su privacidad esten en falsos
     */
    async getDiaries(current, arrayIds) {
      return new Promise((resolve, reject) => {
        var pageSize = current * 10;
        var url = getDatabase().ref('diary').limitToLast(pageSize).orderByChild("privacy").equalTo(false);
        url.on('value', (snap) => {
          var diaries = [];
          snap.forEach((child) => {
            if (arrayIds.includes(child.val().idOwner)) {
              if (child.val().status === true) {
                diaries.push({
                  _key: child.key,
                  name: child.val().name,
                  description: child.val().description,
                  url: child.val().url,
                  idOwner: child.val().idOwner
                });
              }
            }
          });
          resolve(diaries.reverse())
        })
      })
    }
    /*
      Obtiene el usuario y arma un objeto con el usuario + diario donde retorna ese objeto
     */
    async getUser(dataUser) {
      try {
        return new Promise((resolve, reject) => {
          console.log(dataUser);
          var diaries = [];
          var ref = getDatabase().ref("users/" + dataUser.idOwner);
          ref.once("value", (snapshot) => {
            var val = snapshot.val();
            diaries = {
              _key: dataUser._key,
              name: dataUser.name,
              description: dataUser.description,
              url: dataUser.url,
              idOwner: dataUser.idOwner,
              userNick: val.nickname,
              photoUser: val.url
            }
            resolve(diaries);
          })
        });
      } catch (e) {
        console.log(e);
      } finally {

      }

    };

    async load() {
      try {
        /*Muestra el loading*/
        this.setState({refreshing: true});

        var arrayFollows = [];
        let homeArray = [];
        var current = this.state.currentPageIndex;
        current = current +1;
        this.setState({
          currentPageIndex: current
        });
         var user = await this.getLogin(this.state.idUser);
         arrayFollows.push(this.state.idUser);
         for (var i in user.follows) {
            arrayFollows.push(user.follows[i].uid);
         }
        let array = await this.getDiaries(current , arrayFollows);
        for (var i in array) {
          await this.getUser(array[i]).then(data => {
            homeArray.push(data)
          });
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(homeArray)
        });
        //termina el loading
        this.setState({refreshing: false});

      } catch (error) {
        console.log(error.message);
      }
    }

    async loadRefreshing() {
      try {
        var arrayFollows = [];
        let homeArray = [];
        var current = this.state.currentPageIndex;
        current = current +1;
        this.setState({
          currentPageIndex: current
        });
         var user = await this.getLogin(this.state.idUser);
         arrayFollows.push(this.state.idUser);
         for (var i in user.follows) {
            arrayFollows.push(user.follows[i].uid);
         }
        let array = await this.getDiaries(current , arrayFollows);
        for (var i in array) {
          await this.getUser(array[i]).then(data => {
            homeArray.push(data)
          });
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(homeArray)
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    async loadHome(){
      try {
        this.setState({refreshing: true});

        let homeArray = [];
        var arrayFollows = [];
        var idUser = "";
        await AsyncStorage.getItem("user").then((value) => {
          this.state.idUser = value;
          idUser = value;
        })
       var user = await this.getLogin(idUser);
       arrayFollows.push(idUser);
       for (var i in user.follows) {
          arrayFollows.push(user.follows[i].uid);
       }

        let array = await this.getDiaries(this.state.currentPageIndex,arrayFollows);
        if (array.length == 0) {
          var current = this.state.currentPageIndex;
          while (array.length == 0) {
            current = current +1;
            this.setState({
              currentPageIndex: current
              // showPig: true
            });
            array = await this.getDiaries(current,arrayFollows);
          }
        }

        for (var i in array) {
          await this.getUser(array[i]).then(data => {
            homeArray.push(data);
          });
        }

        /*Carga el home en el dataSource*/
          this.setState({
              dataSource: this.state.dataSource.cloneWithRows(homeArray)
            });
            /*Desaparece el loading*/

            this.setState({refreshing: false});


          /*  this.setState({
              showPig: false
            });*/
      } catch (error) {
        console.log(error.message);
      }
    }

  async componentDidMount() {

    NetInfo.isConnected.fetch().done(isConnected => {
        if (isConnected === true) {
          this.loadHome();
        }else{
          this.loadHome();
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
  /*
  <View>
    <View>
    <Body style={{alignItems:'center'}} >
      <TouchableHighlight onPress={() => navigate('DairyView', {diaryKey:item._key})}>
        <Image source={{uri: item.url}} style={{height: 300, width: Dimensions.get('window').width}} />
      </TouchableHighlight>
      <Text>{item.description}</Text>
    </Body>
  </View>

  <View>
       <Text>{item.name}</Text>
  </View>
  </View>
*/

  _renderItem(item) {
    const { navigate } = this.props.navigation;
    return (
      <View style={{backgroundColor:'white', marginTop:5, marginButton:5}} key={item._key} >
        <View >
          <ListItem>
            <Left>
              <TouchableHighlight onPress={() => navigate('visitProfile', {uid:item.idOwner})}>
                <Thumbnail source={{uri: item.photoUser}}/>
              </TouchableHighlight>
            <Body>
              <TouchableHighlight onPress={() => navigate('visitProfile', {uid:item.idOwner})}>
                <Text>{item.userNick}</Text>
              </TouchableHighlight>
            </Body>
            </Left>
            <Right>
            </Right>
          </ListItem>
          <View style={{ backgroundColor:'white', margin:10}}>
            <TouchableHighlight onPress={() => navigate('DairyView', {diaryKey:item._key})}>
              <Thumbnail square source={{uri: item.url}} style={{height: Dimensions.get('window').height/2, width: Dimensions.get('window').width}}/>
            </TouchableHighlight>
            <Text style={{marginTop:10, marginButton:10}}>{item.name}</Text>
          </View>
          <View style={{backgroundColor:'white', margin:10}}>
            <Text>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
      <HideableView visible={this.state.showSpinnerTop} removeWhenHidden={true} >
         <Spinner color='#41BEB6' />
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
             onEndReached={this.load.bind(this)}
             onEndReachedThreshold={50}
             enableEmptySections={true}
             >
           </ListView>
           <HideableView visible={this.state.showPig} removeWhenHidden={true} duration={100} style={styles.center}>
              <Text style={styles.message}>{strings.iAppearWhenHome}</Text>
              <Text style={styles.message}>{strings.touchMeToCreateHome}</Text>
                <Image
                   style={{width: (Dimensions.get('window').width)/1.2, height: 360}}
                   source={require('../profile/ProfilePig.jpg')} />
           </HideableView>
           <HideableView visible={this.state.showSpinner} removeWhenHidden={true} style={{backgroundColor:'transparent'}}>
              <Spinner color='#41BEB6' />
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
           <MessageBarAlert ref="alert"/>

         </View>
       </Container>
    );
  }
}

const styles = StyleSheet.create({
  center: {
      alignItems: 'center',
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
