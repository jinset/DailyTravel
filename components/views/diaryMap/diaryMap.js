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
import MapView, {Marker} from 'react-native-maps';
import Modal from 'react-native-modalbox';
import HideableView from 'react-native-hideable-view';

// var APIKey = "AIzaSyA1gFC5XmcsWGMF4FkqUZ5xmgDQ31PJvWs";    DANI
var APIKey = "AIzaSyCQjiBm5_7fm6DsB0vf8Mz8Tn6i9xighXM";

var colors = [{type: 'restaurant', name: strings.restaurant, icon: 'restaurant', bg: '#41BEB6', color: 'white', selected: true},
              {type: 'establishment', name: strings.establishment, icon: 'location-city', bg: 'white', color: '#808080', selected: false},
              {type: 'cafe', name: strings.coffe, icon: 'free-breakfast', bg: 'white', color: '#808080', selected: false},
              {type: 'food', name: strings.food, icon: 'local-pizza', bg: 'white', color: '#808080', selected: false},
              {type: 'bar', name: strings.bar, icon: 'local-bar', bg: 'white', color: '#808080', selected: false}
            ];

var types = [{ restaurants: [],
               establishments: [],
               cafe: [],
               food: [],
               bar: [],
            }];

export default class DiaryMap extends Component {

/////////////////////////////////////// Navigation Options /////////////////////////////////////////////////////
      static navigationOptions = {
        header: null,
      }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Constructor ///////////////////////////////////////////////////////////
   constructor() {
       super();
       this.state = {
         region: {
           latitude: null,
           longitude: null,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
         },
         places: [], // Total list of places
         type: 'food', // Type by default in getPlaces()
         typeName: strings.restaurant, // Search Placeholder
         radius: 500, // radius of search in getPlaces()
         active: false, // Fab active false
         arrow: 'keyboard-arrow-down', // Switch of arrow in Fab
         colors: colors, // List to switch color of options after Fab is opened
         icon: '', //List to switch icons
         sltPlace: 'Select a place to travel', // The selected place of the list showed in the modal
       }
    }
    /*latitude: 10.00253, longitude: -84.14021,*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentWillMount(){
        this.doCurrent()
        this.selectType(0)
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// Set Region //////////////////////////////////////////////////////////////
  setRegion(lat, lon){
    this.setState({
      region: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    })
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Do Current ////////////////////////////////////////////////////
    doCurrent(){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          this.setRegion(lat, lon)
          this.getPlaces()
        }, (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 25000}
        /* Mobile
        {enableHighAccuracy: false, timeout: 25000}*/
      )
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// Do Watch /////////////////////////////////////////////////////////////////
    doWatch(){
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          this.setRegion(lat, lon)
        }, (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 25000}
        /* Mobile
        {enableHighAccuracy: false, timeout: 25000}*/
      )
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Url /////////////////////////////////////////////////////////////////////
getUrl(lat, long, radius, type){
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
  const location = `location=${lat},${long}&radius=${radius}`;
  const typeData = `&types=${type}`;
  const key = `&key=${APIKey}`;
  return `${url}${location}${typeData}${key}`;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Places ////////////////////////////////////////////////////////////////////
  getPlaces(){
    const url = this.getUrl(this.state.region.latitude, this.state.region.longitude, this.state.radius, this.state.type)
    fetch(url)
     .then((data) => data.json())
     .then((res) => {
       if(res.status === "OK"){
       var placesArray = [];
       var icon = this.state.icon;
       res.results.map((place, i) =>{
           placesArray.push(
             <Marker
               key={i}
               coordinate={{
                 latitude: place.geometry.location.lat,
                 longitude: place.geometry.location.lng
               }}>
               <Icon large color='black' name={icon}/>
             </Marker>
           )
       })
       this.setState({
         places: res.results.slice(0),
         placesLocation: placesArray
       })
     }else{
       alert("DENIED")
     }
    })

  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// Select Place ///////////////////////////////////////////////////////////////
// Placeholder of search
selectPlace(p){
  this.setState({
    sltPlace: p.name,
  })
  this.refs.modal1.close()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Search ////////////////////////////////////////////////////////////////////
   search(text){
     var results = [];
     if(text.length > 1){
       this.state.places.map((p, i) => {
         if(p.name.toLowerCase().match(text)){
           results.push(p)
         }
       })
       this.setState({
         places: results.reverse()
       })
     }else{
       this.getPlaces()
     }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Select Type ////////////////////////////////////////////////////////////////////
  selectType(i){
    var type = colors[i].type;
    var name = colors[i].name;
    var icon = colors[i].icon;
    this.setState({type: type,
                   typeName: name,
                   icon: icon})
    for(j=0; j<colors.length; j++){
      if(i == j){
        colors[j].bg = '#41BEB6';
        colors[j].color = 'white';
        colors[j].selected = true;
        this.setState({ colors: colors})
      }else{
        colors[j].bg = 'white';
        colors[j].color = '#808080';
        colors[j].selected = false;
      }
    }
    this.getPlaces()
  }


  render() {
    const { navigate } = this.props.navigation;

    listFabs = this.state.colors.map((c, i) => {
                  return (
                    <Button onPress={() => { this.selectType(i)}} style={{ backgroundColor: c.bg, zIndex: 2}}>
                        <Icon color={c.color} name={c.icon} />
                    </Button>
                  )
              })
    listPlaces = this.state.places.map((p, i) => {
                    return (
                              <List>
                                  <ListItem>
                                      <Text style={styles.place} onPress={() =>{ this.selectPlace(p) }}>{p.name}</Text>
                                  </ListItem>
                              </List>
                            )
                })
    return (
          <Container>
                  <View style={styles.search}>
                      <Header style={{backgroundColor: 'white', position: 'absolute', zIndex: 3}} searchBar rounded>
                          <Item>
                            <Icon name="search" />
                            <Input placeholder={strings.searchBy +' '+ this.state.typeName}
                                   maxLength = {20}
                                   onChangeText={(text) => this.search(text)}
                                   onFocus={() =>{ this.refs.modal1.open()}}
                            />
                          </Item>
                          <Button transparent>
                            <Text>{strings.search}</Text>
                          </Button>
                      </Header>

                  </View>
                  <Modal style={{zIndex: 4}} ref={"modal1"} swipeToClose={this.state.swipeToClose} onClosed={this.onClose}
                            onOpened={this.onOpen} onClosingState={this.onClosingState} backdropContent={true}>
                        <ScrollView style={{marginTop: 80}}>
                          {listPlaces}
                        </ScrollView>
                        <View style={{justifyContent: 'center', backgroundColor: '#808080', height: 45}}>
                          <Icon large color='white' name="arrow-drop-down-circle"
                                onPress={() =>{ this.refs.modal1.close() }}/>
                        </View>
                  </Modal>
                  <View style={styles.container}>
                    <MapView style={styles.map}
                        provider={MapView.PROVIDER_GOOGLE}
                        initialRegion={this.state.region}
                        onRegionChange={this.doWatch()}
                        showsUserLocation = {true}
                        showsMyLocationButton = {false}
                        showsCompass = {true}>
                        <MapView.Marker coordinate={this.state.region}>
                            <Icon large color='black' name="face"/>
                        </MapView.Marker>
                        {this.state.placesLocation}
                    </MapView>
                    <Fab
                      active={this.state.active}
                      direction="down"
                      containerStyle={{ }}
                      style={{backgroundColor:'#41BEB6', zIndex: 4, top:6}}
                      position="topRight"
                      onPress={() => {
                                        this.setState({active: !this.state.active})
                                        if(this.state.arrow == 'keyboard-arrow-up'){
                                          this.setState({arrow: 'keyboard-arrow-down'})
                                        }else{
                                          this.setState({arrow: 'keyboard-arrow-up'})
                                        }
                                      }
                                }>
                      <Icon color='white' name={this.state.arrow}/>
                      {listFabs}
                    </Fab>
                  {/*<Fab
                    active='false'
                    direction="up"
                    containerStyle={{ }}
                    style={{backgroundColor:'#41BEB6', zIndex: 1}}
                    position="bottomLeft"
                    onPress={()=> navigate('newDiary')}>
                    <Icon color='white' name="library-books" />
                  </Fab>
                 <Fab
                   active='false'
                   direction="up"
                   containerStyle={{ }}
                   style={{backgroundColor:'#41BEB6', zIndex: 1}}
                   position="bottomRight"
                   visible={true}
                   onPress={()=> alert(this.state.region.latitude) }>
                   <Icon color='white' name="my-location" />
                 </Fab>*/}
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
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
  },
  search: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
  },
  place: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000000',
    padding: 10,
  },
});

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
