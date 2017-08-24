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
import { Container, Content, Header, Form, Segment, List, Item, Separator, Input, Radio, Label, Button,Fab,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import baseStyles from '../../style/baseStyles.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import * as firebase from 'firebase';
import { Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import Modal from 'react-native-modalbox';
import HideableView from 'react-native-hideable-view';

export default class AddDailyMap extends Component {

////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
    static navigationOptions = {
      title: "Add this place a to daily",
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4', fontSize:17},
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor() {
       super();
       this.state = {
         diarysId: [],
         dailys: [],
         dailyAdded: [],
       }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentWillMount(){
      this.getDiaries()
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Diaries ///////////////////////////////////////////////////////////
    getDiaries(){
      AsyncStorage.getItem("user").then((value) => {
          let ref = getDatabase().ref("/userDiary")
          diaryList = (ref.orderByChild("idUser").equalTo(value))
          diaryList.once('value', (snap) => {
              var diarysId = [];
              snap.forEach((child) => {
                if(child.val().invitationStatus === true){
                  alert("Id: "+child.val().idDiary)
                  diarysId.push({
                    id: child.val().idDiary,
                  });
                }
              });//forEach
              this.setState({
                diarysId: diarysId.slice(0),
              });
              this.getDailysFromDiaries();
          });//diaryList.on
      });//AsyncStorage
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Diaries ///////////////////////////////////////////////////////////
    getDailysFromDiaries(){
      var dailys = [];
      var diaryName = '';
      this.state.diarysId.forEach((d) => {
          let ref1 = getDatabase().ref(`/diary/${d.id}/daily`)
          getDatabase().ref(`/diary/${d.id}/name`).once('value', (snaps) => {
            diaryName = snaps.val();
          })
          ref1.on('value', (snap) => {
            snap.forEach((child) => {
               var place = child.val().place
               if(place == undefined){
                 place = 'Sin lugar'
               }
               dailys.push({
                 diaryKey: d.id,
                 dailyKey: child.key,
                 diaryName: diaryName,
                 dailyName: child.val().name,
                 dailyPlace: place,
                 dailyDate: child.val().date,
                 added: false,
               })
            });//forEach
          })//ref.once
      })//diarysId.forEach
      this.setState({
        dailys: dailys.slice(0),
      })
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Search ////////////////////////////////////////////////////////////////
  search(text){
    alert("[0].diaryName: "+ this.state.dailys[0].diaryName +"   "+
          "[0].dailyName: "+ this.state.dailys[0].dailyName +"   "+
          "[1].diaryName: "+ this.state.dailys[1].diaryName +"   "+
          "[1].diaryName: "+ this.state.dailys[1].dailyName +"   "/*+
          "[2].diaryName: "+ this.state.dailys[2].diaryName +"   "+
          "[2].diaryName: "+ this.state.dailys[2].dailyName +"   "*/
         )
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Added ////////////////////////////////////////////////////////////////
  added(d, i){
    var dailyAdded = [];
    dailyAdded.push(d);
    this.setState({
      dailyAdded: dailyAdded.slice(0),
    })
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Removed ////////////////////////////////////////////////////////////////
  addPlaceToDaily(daily, place){
    alert(daily.diaryKey)
    var that = this.state;
    var tthat = this;
    /*let checkRepeat = getDatabase().ref('diary/'+daily.diaryKey+'/daily/'+daily.dailyKey+'/place/').orderByChild("uid").equalTo(that.users[i].id);
    checkRepeat.once('value', function(snapshot) {
      if(snapshot.exists() == false){
      }
    })//checkRepeat.once*/
    getDatabase().ref().child('diary/'+daily.diaryKey+'/daily/'+daily.dailyKey+'/place').set(place);
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    let listForAdding = this.state.dailys.map((d,i) => {
      return (
        <TouchableOpacity>
          <List>
              <ListItem onPress={() => this.added(d, i)}>
                  <Left>
                      <Text>{d.dailyName}</Text>
                  </Left>
                  <Left>
                      <Text>{d.dailyPlace}</Text>
                  </Left>
                  <Body>
                      <Text>{d.dailyDate}</Text>
                  </Body>
              </ListItem>
          </List>
          </TouchableOpacity>
            )
      });

      let dailyAdded = this.state.dailyAdded.map((d,i) => {
        return(
          <TouchableOpacity>
            <List>
                <ListItem onPress={() => this.added(d)}>
                    <Left>
                        <Text>{d.dailyName}</Text>
                    </Left>
                    <Body>
                        <Text>{d.dailyDate}</Text>
                    </Body>
                    <Right>
                      <Button rounded light onPress={() => this.addPlaceToDaily(d, params.sltPlace)}>
                        <Text>Add</Text>
                      </Button>
                    </Right>
                </ListItem>
            </List>
            </TouchableOpacity>
        )
      })

    return (
          <Container>
              <Card>
                    <Button full style={{top:40, zIndex: 2, backgroundColor: 'black'}}
                             onPress={()=> navigate('diaryMap')}>
                      <Text style={styles.sltPlace}>{params.sltPlace}</Text>
                    </Button>
                    <List>
                       <ScrollView style={{marginTop: 100}}>
                            {dailyAdded}
                        </ScrollView>
                    </List>
                    <List>
                       <ScrollView style={{marginTop: 100}}>
                            {listForAdding}
                        </ScrollView>
                    </List>
              </Card>
          </Container>
    );
  }
}

const styles = StyleSheet.create({
  sltPlace: {
    fontStyle: 'italic',
    fontSize: 16,
    color: 'white',
    padding: 5,
  },
});

/*<View style={styles.search}>
    <Header style={{backgroundColor: 'white', position: 'absolute', zIndex: 3}} searchBar rounded>
        <Item>
          <Icon name="search" />
          <Input placeholder={'search daily'}
                 maxLength = {20}
                 onChangeText={(text) => this.search(text)}
          />
        </Item>
        <Button transparent>
          <Text>{strings.search}</Text>
        </Button>
    </Header>
</View>*/
