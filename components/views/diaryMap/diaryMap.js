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
import { Container, Content, Header, Form, Segment, Item, Separator, Input, Label, Button,Fab,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
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

var APIKey = "AIzaSyA1gFC5XmcsWGMF4FkqUZ5xmgDQ31PJvWs"

export default class DiaryMap extends Component {

  /////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
      static navigationOptions = {
        header: null,
      }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor() {
       super();
       this.state = {
         region: {
           latitude: null,
           longitude: null,
           latitudeDelta: null,
           longitudeDelta: null,
         },
         lat: null,
         lon: null,
       }
    }
    /*latitude: 10.00253, longitude: -84.14021,*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// CalcDelta ///////////////////////////////////////////////////////////
  calcDelta(lat, lon, accuracy){
    const oneDegreeOfLongitudInMeters = 111.32;
    const circumference = (40075 / 360)

    const latDelta = accuracy * (1 / (Math.cos(lat) * circumference))
    const lonDelta = (accuracy / oneDegreeOfLongitudInMeters)
    this.setState({
      region: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      },
    })
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentWillMount(){
        this.doCurrent()
        //this.doWatch()
        this.getPlaces()
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Url ////////////////////////////////////////////////////////////////
getUrl(lat, long, radius, type){
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
  const location = `location=${lat},${long}&radius=${radius}`;
  const typeData = `&types=${type}`;
  const key = `&key=${APIKey}`;
  return `${url}${location}${typeData}${key}`;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Places ////////////////////////////////////////////////////////////////
  getPlaces(){
    const url = this.getUrl(11.240355, -74.211023, 500, 'food')
    //alert(url)
    fetch(url)
      .then((data) => data.json())
      .then((res) => {
        const places = [];
        alert(res.results.length)
        res.results.map((element, i) => {
          places.push(element.geometry.location.lat)
        })
      })
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Do Current ////////////////////////////////////////////////////
    doCurrent(){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          /*alert("Latitud: "+ position.coords.latitude +"     "+
                "Longitud: "+position.coords.longitude)*/
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          const accuracy = position.coords.accuracy
          this.calcDelta(lat, lon, accuracy)
        }, (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 10000}
      )
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// Do Watch /////////////////////////////////////////////////////////////////
    doWatch(){
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          const accuracy = position.coords.accuracy
          this.calcDelta(lat, lon, accuracy)
        }, (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 10000}
      )
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// Get Initial State ////////////////////////////////////////////////////////////
    /*getInitialState() {
      return {
        region: new MapView.AnimatedRegion({
          latitude: 10.00253,
          longitude: -84.14021,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }),
      };
    }*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {

    const { navigate } = this.props.navigation;

    return (
          <Container>
            <Header style={{backgroundColor: 'white'}} searchBar rounded>
                 <Item>
                   <Icon name="search" />
                   <Input placeholder={strings.search}
                          maxLength = {20}
                          onChangeText={(text) => this.search(text)}
                   />
                 <Icon name="place" />
                 </Item>
                 <Button transparent>
                   <Text>{strings.search}</Text>
                 </Button>
            </Header>
                  <View style={styles.container}>
                    <MapView style={styles.map}
                        provider={MapView.PROVIDER_GOOGLE}
                        initialRegion={this.state.region}
                        showsUserLocation = {true}
                        showsMyLocationButton = {true}
                        showsCompass = {true}>
                        <MapView.Marker coordinate={this.state.region}>
                            <Icon large color='black' name="face" />
                        </MapView.Marker>
                    </MapView>
                 <Fab
                   active='false'
                   direction="up"
                   containerStyle={{ }}
                   style={{  backgroundColor:'#41BEB6'}}
                   position="bottomLeft"
                   onPress={()=> navigate('newDiary')}>
                   <Icon color='white' name="library-books" />
                 </Fab>
                 <Fab
                   active='false'
                   direction="up"
                   containerStyle={{ }}
                   style={{  backgroundColor:'#41BEB6'}}
                   position="bottomRight"
                   onPress={()=> alert("Dirigir a mi posicion actual") }>
                   <Icon color='white' name="face" />
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
