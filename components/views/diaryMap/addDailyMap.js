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

export default class AddDailyMap extends Component {

  ////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
    static navigationOptions = {
      title: "Add this place a to daily",
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor() {
       super();
       this.state = {
         diarysId: [],
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
                if(child.val().status===true){
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
      this.state.diarysId.forEach((d) => {
          let ref = getDatabase().ref(`/diary/${d.id}/daily`)
          ref.once('value', (snap) => {
            var diarysId = [];
            alert(snap[0].val().name)
            snap.forEach((child) => {
               alert(child.val().name)
            });//forEach
          })
      })
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Search ////////////////////////////////////////////////////////////////
  search(text){

  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { navigate } = this.props.navigation;

    return (
          <Container>
              <View style={styles.search}>
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
              </View>
          </Container>
    );
  }
}

const styles = StyleSheet.create({

});
