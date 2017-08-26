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
      title: strings.addThisPlaceToADaily,
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
         showPig: false,
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
               {/*var place = child.val().place
               if(place == undefined){
                 place = string.notPlace
               }*/}
               if(child.val().status == true){
                 dailys.push({
                   diaryKey: d.id,
                   dailyKey: child.key,
                   diaryName: diaryName,
                   dailyName: child.val().name,
                   dailyPlace: child.val().place,
                   dailyDate: child.val().date,
                   added: false,
                 })
               }//if
            });//forEach
          })//ref.once
      })//diarysId.forEach
      this.setState({
        dailys: dailys.slice(0),
      })
      this.checkPig()
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  checkPig(){
    if(this.state.dailys.length == 0){
      this.setState({
        showPig: true
      })
    }else{
      this.setState({
        showPig: false
      })
    }
  }

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
    const { goBack } = this.props.navigation;
    var that = this.state;
    var tthat = this;
    /*let checkRepeat = getDatabase().ref('diary/'+daily.diaryKey+'/daily/'+daily.dailyKey+'/place/').orderByChild("uid").equalTo(that.users[i].id);
    checkRepeat.once('value', function(snapshot) {
      if(snapshot.exists() == false){
      }
    })//checkRepeat.once*/
    getDatabase().ref().child('diary/'+daily.diaryKey+'/daily/'+daily.dailyKey+'/place').set(place);
    goBack();
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    let listForAdding = this.state.dailys.map((d,i) => {
      return (
              <ListItem
                onPress={() => this.added(d, i)}>
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
            )
      });

      let dailyAdded = this.state.dailyAdded.map((d,i) => {
        return(
                <ListItem
                  onPress={() => this.added(d)}>
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
        )
      })

    return (
          <Container>
          <Content>
              <Card style={{flexDirection: 'column'}}>
                    <Button full style={{top:20, zIndex: 2, backgroundColor: 'black'}}
                             onPress={()=> navigate('diaryMap')}>
                      <Text style={styles.sltPlace}>{params.sltPlace}</Text>
                    </Button>
                    <List>
                       <ScrollView style={{marginTop: 50}}>
                            {dailyAdded}
                        </ScrollView>
                    </List>
                    <List>
                       <ScrollView style={{marginTop: 50}}>
                            {listForAdding}
                        </ScrollView>
                    </List>
                    <HideableView visible={this.state.showPig} removeWhenHidden={true} duration={100} style={styles.center}>
                       <Text style={styles.message}>{strings.iAppearWhenAddPlaceInDaily}</Text>
                       <Text style={styles.message}>{strings.touchMeToCreate}</Text>
                       <TouchableOpacity onPress={()=>navigate('profile')}>
                         <Image
                            style={{width: (Dimensions.get('window').width)/1.2, height: 360}}
                            source={require('../../common/pigs/EmptyDailyInAddPlace.png')} />
                      </TouchableOpacity>
                    </HideableView>
              </Card>
              </Content>
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
