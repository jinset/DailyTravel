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
import MapView, {Marker, Callout} from 'react-native-maps';
import Modal from 'react-native-modalbox';
import HideableView from 'react-native-hideable-view';

//var APIKey = "AIzaSyA1gFC5XmcsWGMF4FkqUZ5xmgDQ31PJvWs";  //DANI
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
         radius: 5000, // radius of search in getPlaces()
         active: false, // Fab active false
         arrow: 'keyboard-arrow-down', // Switch of arrow in Fab
         colors: colors, // List to switch color of options after Fab is opened
         icon: '', // List to switch icons
         sltPlace: 'Select a place to travel', // The selected place of the list showed in the modal
         buttonDisabled: true, // Button starts disabled until the user pick a place
         buttonDisabledColor: '#73797D', // Button starts grey until the user pick a place
         fabDisabled: true, // Fab starts disabled until the user pick a place
         fabDisabledColor: '#73797D', // Fab starts grey until the user pick a place
         dailies: [], // List of Ids of dailies
       }
    }
    /*latitude: 10.00253, longitude: -84.14021,*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Component Did Mount ////////////////////////////////////////////////////
    async componentWillMount(){
        var getUbication = await this.doCurrent();
        if(getUbication == true){
          this.selectType(0);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// Set Region //////////////////////////////////////////////////////////////
  async setRegion(lat, lon){
    return new Promise((resolve, reject) => {
      this.setState({
        region: {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0722,
          longitudeDelta: 0.0221,
        },
      })
      resolve(true)
    })
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Do Current ////////////////////////////////////////////////////
    doCurrent(){
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async(position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            var region = await this.setRegion(lat, lon);
            if(region == true){
              this.getPlaces()
            }
          }, (error) => console.log(error.message),
          {enableHighAccuracy: true, timeout: 25000}
          //Mobile
          // {enableHighAccuracy: false, timeout: 25000}
        )
        resolve(true)
      })
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// Do Watch /////////////////////////////////////////////////////////////////
    doWatch(){
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          this.setRegion(lat, lon)
        }, (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 25000}
        // Mobile
        // {enableHighAccuracy: false, timeout: 25000}
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  touchMarker(place){
    this.setState({
      sltPlace: place.name,
      buttonDisabled: false,
      buttonDisabledColor: 'black'
    })
    this.getDailies(place.name);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Get Places ////////////////////////////////////////////////////////////////////
  async getPlaces(){
    try{
        const { navigate } = this.props.navigation;
        const url = this.getUrl(this.state.region.latitude, this.state.region.longitude, this.state.radius, this.state.type)
        fetch(url)
         .then((data) => data.json())
         .then(async(res) => {
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
                     }}
                     onPress={() => this.touchMarker(place)}>
                      <Icon large color='black' name={icon}/>
                       <Callout>
                          <View style={{width:150, alignItems:'center'}}>
                            <Text style={{fontStyle: 'italic', fontSize: 18, fontWeight:'bold'}}>{place.name}</Text>
                          </View>
                       </Callout>
                   </Marker>
                 )
             })
             this.setState({
               places: res.results.slice(0),
               placesLocation: placesArray
             })
           }
        })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// Select Place ///////////////////////////////////////////////////////////////
// Placeholder of search
selectPlace(p){
  this.setState({
    sltPlace: p.name,
    buttonDisabled: false,
    buttonDisabledColor: 'black'
  })
  this.getDailies(p.name)
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

  async changeFabColors(i){
    return new Promise((resolve, reject) => {
      var type = colors[i].type;
      var name = colors[i].name;
      var icon = colors[i].icon;
      this.setState({
        type: type,
        typeName: name,
        icon: icon
      })
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
      resolve(true)
    })
  }

/////////////////////////////////////// Select Type ////////////////////////////////////////////////////////////////////
  async selectType(i){
      var changeFabColors = await this.changeFabColors(i);
      if(changeFabColors == true){
        this.getPlaces();
      }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setDailies(dailies){
   return new Promise((resolve, reject) => {
     this.setState({
       dailies: dailies.slice(0)
     })
     resolve(true)
   })
 }

 async getDailies(place){
   var dailies = [];
   let refDiary = getDatabase().ref("/diary")
   refDiary.once('value', async(snap)=>{
     snap.forEach((child) =>{
       let refDaily = getDatabase().ref("/diary/"+child.key+"/daily")
       dailyList = (refDaily.orderByChild("place").equalTo(place));
       dailyList.once('value', (snap)=>{
         snap.forEach((child)=>{
           if(child.val().status == true){
             dailies.push({
               key: child.key
             })//push
           }//if
         })//forEach Daily
       })//dailyList.once
     })//forEach diary
     let setDailies = await this.setDailies(dailies)
     if(setDailies == true){
       this.toggleFab();
     }
   })//ref.once
 }

  toggleFab(){
    if(this.state.dailies.length == 0){
      this.setState({
        fabDisabled: true,
        fabDisabledColor: '#73797D'
      })
    }else{
      this.setState({
        fabDisabled: false,
        fabDisabledColor: '#41BEB6'
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
                  {/* *********************************************************************************** */}
                  {/* Search View */}
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
                      </Header>
                      <Button full style={{top:60, zIndex: 2, backgroundColor: this.state.buttonDisabledColor}}
                              disabled={this.state.buttonDisabled}
                              onPress={()=> navigate('addDailyMap', {sltPlace:this.state.sltPlace})}>
                        <Text style={styles.sltPlace}>{this.state.sltPlace}</Text>
                      </Button>
                  </View>
                  {/* *********************************************************************************** */}
                  {/* Modal of search */}
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
                  {/* ************************************************************************************ */}
                  {/* MapView and Fabs */}
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
                   <Fab
                     disabled={this.state.fabDisabled}
                     active='false'
                     direction="up"
                     containerStyle={{ }}
                     style={{backgroundColor:this.state.fabDisabledColor, zIndex: 0}}
                     position="bottomRight"
                     visible={true}
                     onPress={()=> navigate('dailyMap', {listDailyKey: this.state.dailies})}>
                     <View style={{flexDirection:'row'}}>
                       <Icon color='white' name="satellite"/>
                       <Text style={{fontStyle: 'italic', fontSize: 24, fontWeight:'bold', color:'white'}}>{this.state.dailies.length}</Text>
                     </View>
                   </Fab>
              </View>
              {/* MapView and Fabs*/}
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
  sltPlace: {
    fontStyle: 'italic',
    fontSize: 16,
    color: 'white',
    padding: 5,
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
