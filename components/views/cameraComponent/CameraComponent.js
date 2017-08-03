import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Button,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';
import { Container, Content, Form, Item, Input, Label,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge  } from 'native-base';
import Helper from '../profile/helper';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import { getStorage } from '../../common/database';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, imageName) => {
      const mime='image/jpg'
      return new Promise((resolve, reject) => {
         const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
         let uploadBlob = null
         const imageRef = firebase.storage().ref('images/profile/').child(imageName)
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

export default class CameraComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        imagePath: '',
        imageHeight: '',
        imageWidth: '',
        uid: '',
      }
   }

  async componentWillMount () {
     try{
       AsyncStorage.getItem("user").then((value) => {
             this.setState({
               uid: value
             })
             Helper.getImageUrl(this.state.uid, (url) => {
               this.setState({
                 imagePath: url,
               })
             })
        })
     } catch(error){
       console.log(error)
     }
   }

   openImagePicker(){
     var options = {
       title: strings.select,
       takePhotoButtonTitle: strings.takePhoto,
       chooseFromLibraryButtonTitle: strings.chooseFromLibrary,
       cancelButtonTitle: strings.cancel,
       mediaType: 'photo',
       storageOptions: {
         skipBackup: true,
         path: 'images/profile'
       }
     }
     ImagePicker.showImagePicker(options, (response) => {
       if(response.didCancel){
         console.log('User cancelled image picker')
       }else if(response.error){
         console.log('Error'+response.error)
       }else if(response.customButton){
         console.log('User tapped custom button'+response.customButton)
       }else{
         this.setState({
           imagePath: response.uri,
         })
         this.createImage()
       }
     })
   }

   createImage(){
     if(this.state.uid){
         try{
            this.state.imagePath ?
                uploadImage(this.state.imagePath, `${this.state.uid}.jpg`)
                    .then((responseData) => {
                      Helper.setImageUrl(this.state.uid, responseData)
                    })
                    .done()
                : null
         } catch(error){
           alert(error)
         }
     }
   }

  render(){
    return (
        <View>
            <TouchableHighlight onPress={this.openImagePicker.bind(this)}>
              <Thumbnail
                style={{width: 110, height: 110, borderStyle: 'solid', borderWidth: 2, borderColor: '#41BEB6'}}
                large
                source={{uri: this.state.imagePath}}
              />
            </TouchableHighlight>
      </View>
  )}

}

module.export = CameraComponent;
