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
import { Container, Content, Form, Segment, Item, Separator, Input, Label, Button,Fab,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import baseStyles from '../../style/baseStyles.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraProfileComponent from '../cameraComponent/CameraProfileComponent';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';
import HideableView from 'react-native-hideable-view';
import MapView from 'react-native-maps';

export default class DiaryMap extends Component {

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor() {
       super();
       this.state = {
         region: {
           latitude: null,
           longitude: null,
           latitudeDelta: null,
           longitudeDelta: null,
         }
       }
    }
    /*
    latitude: 10.00253,
    longitude: -84.14021,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
    static navigationOptions = {
      title: "Mapa",
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// CalcDelta ///////////////////////////////////////////////////////////
/*  calcDelta(lat, lon, accuracy){


    const latDelta =
    const lonDelta = (accuracy / oneDegreeOfLongitudInMeters)

    this.setState({
      region: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      }
    })
  }   */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////

async componentWillMount(){
const oneDegreeOfLongitudInMeters = 111.32;
const circumference = (40075 / 360);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0462,
          longitudeDelta: 0.0462,
        },
      });
    },
    (error) => alert(error.message),
      {enableHighAccuracy: false, timeout: 25000}
  )
  navigator.geolocation.watchPosition(
    (position) => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0462,
          longitudeDelta: 0.0462,
        },
      });
    }, (error) => alert(error.message),
    {
      enableHighAccuracy: false, timeout: 25000
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {

    const { navigate } = this.props.navigation;

    return (
          <Container>
                  <View style={styles.container}>
                  {this.state.region.latitude ?
                        <MapView style={styles.map}
                        initialRegion={this.state.region}
                        showsUserLocation = {true}
                  /> : null}
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
