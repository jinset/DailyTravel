import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  ListView,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { Container, Content, Button, Text, Input,Item,Label, Form, Thumbnail } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';
import firebase from 'firebase';



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

export default class CreateDaily extends Component{

  constructor(props){
    super(props);
    this.state = {
      name: null,
      experience: null,
      tips: null,
      date: new Date().toLocaleDateString(),
      imageName: new Date().toString(),
      status: true,
      imageArray:null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  static navigationOptions = {
    title: strings.daily,
    headerStyle: {height: 50 },
    headerTitleStyle : {color:'#9A9DA4',fontSize:17},
 };

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
     }
   )
 }

 saveImage(){
   const { params } = this.props.navigation.state;
   let idDiary = params.diaryKey;
   let idDaily = null;
   let ref = getDatabase().ref("/diary/"+idDiary+"/daily")
   ref.endAt().limitToLast(1).on('child_added', function(snapshot) {
    idDaily = snapshot.key
  });

   try{
     this.state.imageArray ?
      this.state.imageArray.map(image =>{
        uploadImage(image, this.state.imageName)
          .then((responseData) => {
            alert(responseData);
            //Helper.setImageUrl(this.state.uid, responseData)
            getDatabase().ref().child('/diary/'+idDiary+"/daily/"+idDaily+"/photos/").push({
              url: responseData,
            });
            getDatabase().ref().child('/diary/'+idDiary+"/daily/"+idDaily+"/url").set(responseData);
          })
        })
      : null
    } catch(error){
      alert(error)
    }
 }

  addDaily(){
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;
    let idDiary = params.diaryKey;
    getDatabase().ref().child('/diary/'+idDiary+"/daily/").push({
      name: this.state.name,
      date: this.state.date,
      experience: this.state.experience,
      tips: this.state.tips,
      status: this.state.status,
    });
    this.saveImage()
    goBack();
  }

  renderImages(image){
    return(
      <Image source={{uri: image.url}} style={{width: 100, height: 100}}/>
    )
  }

  render() {
    return(
      <Container>
        <Content>
        <Form>

            <Item stackedLabel>
              <Label>{strings.name }</Label>
              <Input
                onChangeText={(text) => this.setState({name:text})}
              />
            </Item >

            <Item>
                <DatePicker
                    iconComponent={<Icon active name='date-range' style={{position: 'absolute', left: 5, top: 5, marginLeft: 0}}/>}
                    style={{width: 150, margin:10}}
                    date={Moment(this.state.date, 'MM/DD/YY')}
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

                <TouchableOpacity style={{margin: 20}}
                  onPress={this.openImagePicker.bind(this)}>
                  <Icon name="photo"/>
                </TouchableOpacity>

                {/*<Thumbnail
                  square
                  source={{uri: this.state.images}}
                />*/}
              </Item>

              <Item>
                <ScrollView horizontal={true} >
                  <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderImages.bind(this)}
                  />
                </ScrollView>
              </Item>


              <Label>{strings.experiences}</Label>
              <AutogrowInput
                style={{minHeight:Dimensions.get('window').height/7, fontSize: 18}}
                onChangeText={(text) => this.setState({experience:text})}
              />



              <Label>{strings.tips }</Label>
              <AutogrowInput
                style={{minHeight:Dimensions.get('window').height/7, fontSize: 18}}
                onChangeText={(text) => this.setState({tips:text})}
              />

          </Form>
        </Content>

        <Button full dark style= {{backgroundColor: '#41BEB6'}}
              onPress={this.addDaily.bind(this)}>
              <Text>{strings.save}</Text>
          </Button>

      </Container>
    );
  }
}


AppRegistry.registerComponent('CreateDaily', () => CreateDaily);

module.export='CreateDaily';
