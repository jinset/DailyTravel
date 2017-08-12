import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Image,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
import { Container, Content, Button, Text, Input, Item, Label, Card, Form, Thumbnail } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import firebase from 'firebase';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import MultiImage from 'react-native-multi-image-selector'

import RNFetchBlob from 'react-native-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, imageName) => {
  const mime='image/jpg'
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    let uploadBlob = null
    const imageRef = firebase.storage().ref('images/daily/').child(imageName)
    fs.readFile(uploadUri, 'base64')
    .then((data) => {
      return Blob.build(data, {type: `${mime};BASE64`})
    })
    .then((blob) => {
      uploadBlob = blob
      return imageRef.put(blob, {contentType: mime})
    })
    .then(() => {
      uploadBlob.close()
      return imageRef.getDownloadURL()
    })
    .then((url) => {
      resolve(url)
    })
    .catch((error) => {
      reject(error)
    })
  })
}


export default class EditDaily extends Component{

  constructor(props){
    super(props);
    const { params } = this.props.navigation.state;
    let idDiary = params.idDiary;
    let idDaily = params.idDaily;
    this.dataRef = getDatabase().ref("/diary/"+idDiary+"/daily/"+idDaily);
    this.dataRef.once('value', (snap) => {
        this.state= {
          idDiary: params.idDiary,
          idDaily: snap.key,
          name: snap.val().name,
          date: snap.val().date,
          experience: snap.val().experience,
          tips: snap.val().tips,
          imageName: new Date().toString(),
          status: true,
          imageArray:null,
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          })
        };
    });
  }

  static navigationOptions = ({ navigation }) => ({
      title: strings.daily,
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    });

  openImagePicker(){
    MultiImage.pickImage({}).then((imageArray)=> {
      var images = [];
      imageArray.map(image => {
        images.push({
          url: image
        })
      })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(images),
          imageArray: imageArray
        })
        console.log(this.state.dataSource)
        console.log(imageArray)
      }
    )
  }

  saveImage(){
    let idDiary = this.state.idDiary;
    let idDaily = this.state.idDaily;
    let count = 0;
    try{
      this.state.imageArray ?
       this.state.imageArray.map(image =>{
         count = count + 1;
         console.log(this.state.imageArray)
         console.log(image)
         uploadImage(image, this.state.imageName+count)
           .then(function(responseData){
             console.log(responseData)
             getDatabase().ref().child('/diary/'+idDiary+"/daily/"+idDaily+"/photos/").push({
               url: responseData,
             });
             getDatabase().ref().child('/diary/'+idDiary+"/daily/"+idDaily+"/url").set(responseData);
           }, function(responseData){
             alert(responseData);
           });
         })
       : null
     } catch(error){
       alert(error)
     }
  }

  updateDaily(){
    MessageBarManager.registerMessageBar(this.refs.alert);
    var that = this.state;
    if (that.name.trim() == '') {
      MessageBarManager.showAlert({
         message: strings.blankName,
         alertType: 'info',
         position: 'bottom',
         duration: 4000,
         stylesheetInfo: { backgroundColor: '#808080', strokeColor: 'grey' }
      });
    }else{
      const { goBack } = this.props.navigation;
      let idDiary = this.state.idDiary;
      let idDaily = this.state.idDaily;
      getDatabase().ref().child('/diary/'+idDiary+'/daily/'+idDaily).update({
        name: this.state.name,
        date: this.state.date,
        experience: this.state.experience,
        tips: this.state.tips,
        status: this.state.status,
      });
      this.saveImage()
      goBack(null);
    }
  }

  renderImages(image){
    return(
      <Image source={{uri: image.url}} style={{width: 100, height: 100, marginRight:5}}/>
    )
  }

  render() {
    return(
      <Container>
        <Content style={{backgroundColor:'white'}}>
          <Form style={{padding:10}}>
            <Label>{strings.name }</Label>
            <Input
              style={{fontSize: 18}}
              maxLength={40}
              value = {this.state.name}
              onChangeText={(text) => this.setState({name:text})}
            />

            <Item>
              <DatePicker
                  iconComponent={<Icon active name='date-range' style={{position: 'absolute', left: 5, top: 5, marginLeft: 0}}/>}
                  style={{width: 150, margin:10}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="MM/DD/YY"
                  //minDate="2016-05-01"
                  //maxDate="2016-05-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                   }}
                 onDateChange={(date) => {this.setState({date: date})}}
              />
            </Item>


              <ScrollView horizontal={true} >
                <TouchableOpacity style={{margin: 20,marginTop:40}}
                  onPress={this.openImagePicker.bind(this)}>
                  <Icon name="add-a-photo"/>
                </TouchableOpacity>

                <ListView
                  horizontal={true}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderImages.bind(this)}
                />
              </ScrollView>

              <Label>{strings.experiences}</Label>
              <AutoGrowingTextInput
                style={{fontSize: 18}}
                maxHeight={150}
                minHeight={45}
                value = {this.state.experience}
                onChangeText={(text) => this.setState({experience:text})}
              />

              <Label>{strings.tips }</Label>
              <AutoGrowingTextInput
                style={{fontSize: 18}}
                maxHeight={150}
                minHeight={45}
                value = {this.state.tips}
                onChangeText={(text) => this.setState({tips:text})}
              />

          </Form>
          <MessageBarAlert ref="alert" />
        </Content>

          <Button full dark style= {{backgroundColor: '#41BEB6', zIndex: -1}}
              onPress={this.updateDaily.bind(this)}>
              <Text>{strings.save}</Text>
          </Button>
      </Container>
    );
  }
}


AppRegistry.registerComponent('EditDaily', () => EditDaily);

module.export='EditDaily';
