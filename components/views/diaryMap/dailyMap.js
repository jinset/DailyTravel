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
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Header, Form, Segment, List, Item, Separator, Input, Label, Button,Fab,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge} from 'native-base';
import strings from '../../common/local_strings.js';
import baseStyles from '../../style/baseStyles.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import * as firebase from 'firebase';
import { Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import Modal from 'react-native-modalbox';
import HideableView from 'react-native-hideable-view';
import { ListItem } from 'react-native-elements';

export default class DailyMap extends Component {

/////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
      static navigationOptions = {
        title: strings.visitTheDailies,
        headerStyle: {height: 50 },
        headerTitleStyle : {color:'#9A9DA4',fontSize:17},
      }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor() {
       super();
       this.state = {
         dailies: [], // List of data from dailies
         refreshing: false,
         dataSource: new ListView.DataSource({
           rowHasChanged: (row1, row2) => row1 !== row2,
         })
       }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentDidMount(){
      const { params } = this.props.navigation.state;
      this.getDailies(params.listDailyKey);
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Dailies //////////////////////////////////////////////////////////
    getDailies(listDailyKey){
      var dailies = [];
      listDailyKey.forEach((d) =>{
          var dailyKey = d.key
          let refDiary = getDatabase().ref(`/diary`)
          refDiary.once('value', (snap)=>{
              snap.forEach((child) =>{
                  let refDaily = getDatabase().ref(`/diary/${child.key}/daily`)
                  dailyList = (refDaily.orderByKey().equalTo(dailyKey));
                  dailyList.once('value', (snap)=>{
                    snap.forEach((child)=>{
                        dailies.push({
                          key: child.key,
                          name: child.val().name,
                          date: child.val().date,
                          experience: child.val().experience,
                          tips: child.val().tips,
                          url: child.val().url,
                        })//push
                    })//forEach Daily
                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows(dailies)
                    });
                  })//dailyList.once
              })//forEach refDiary
          })//refDiary.once
      })//listDailyKey.forEach
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    _onRefresh() {
       this.setState({refreshing: true});
       this.loadRefreshing().then(() => {
         this.setState({refreshing: false});
       });
     }

     async loadRefreshing() {
       try {
         const { params } = this.props.navigation.state;
         alert(params.listDailyKey)
         this.getDailies(params.listDailyKey);
       } catch (error) {
         console.log(error.message);
       }
     }

     _renderItem(daily) {
         const { params } = this.props.navigation.state;
         return (
           <ListItem
               roundAvatar
               key={daily.key}
               avatar={{uri:daily.url}}
               title={daily.name}
               subtitle={daily.date}>
           </ListItem>
         );
     }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
          <Container>
              <Content>
                  <Card style={{flexDirection: 'column', height: Dimensions.get('window').height}}>
                    <CardItem>
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
                          enableEmptySections={true}>
                        </ListView>
                    </CardItem>
                  </Card>
              </Content>
          </Container>
    );
  }
}

const styles = StyleSheet.create({
    column: {
      flexDirection: 'column',
    },
    row: {
      flexDirection: 'row',
    },
});
