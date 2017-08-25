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
import { Container, Content, Header, Form, Segment, List, Item, Separator, Input, Label, Button,Fab,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import baseStyles from '../../style/baseStyles.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import * as firebase from 'firebase';
import { Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import Modal from 'react-native-modalbox';
import HideableView from 'react-native-hideable-view';

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
       }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentWillMount(){
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
                  let idDiary= child.key
                  let refDaily = getDatabase().ref(`/diary/${child.key}/daily`)
                  dailyList = (refDaily.orderByKey().equalTo(dailyKey));
                  dailyList.once('value', (snap)=>{
                    snap.forEach((child)=>{
                        dailies.push({
                          idDiary: idDiary,
                          key: child.key,
                          name: child.val().name,
                          date: child.val().date,
                          experience: child.val().experience,
                          tips: child.val().tips,
                          url: child.val().url,
                        })//push
                    })//forEach Daily
                    this.setState({
                      dailies: dailies.slice(0)
                    })
                  })//dailyList.once
              })//forEach refDiary
          })//refDiary.once
      })//listDailyKey.forEach
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    let listDailies = this.state.dailies.map((d,i) => {
      return(
              <ListItem
                onPress={() => alert("ni merga")}>
                  <Left>
                      <Text>{d.name}</Text>
                  </Left>
                  <Body>
                      <Text>{d.data}</Text>
                  </Body>
                  <Right>
                    <TouchableOpacity onPress={()=> navigate('showGallery', {idDaily:this.state.idDaily, idDiary:this.state.idDiary})}>
                      <Icon active name='visibility' />
                    </TouchableOpacity>
                  </Right>
              </ListItem>
      )
    })

    return (
          <Container>
              <Content>
                  <Card style={{flexDirection: 'column', height: Dimensions.get('window').height}}>
                    <List>
                         <ScrollView style={{marginTop: 50}}>
                            {listDailies}
                         </ScrollView>
                   </List>
                  </Card>
              </Content>
          </Container>
    );
  }
}

const styles = StyleSheet.create({

});
