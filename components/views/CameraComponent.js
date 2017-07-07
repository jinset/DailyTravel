/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Button,
} from 'react-native';
import Helper from '../common/helper';
import { Icon } from 'react-native-elements';
import { getDatabase } from '../common/database';
import { getStorage } from '../common/database';
import { getUser } from '../common/userState';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import * as firebase from 'firebase'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest - RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

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

   uploadImage = (uri, imageName, mime='image/jpg') => {
      return new Promise((resolve, reject) => {
         alert("uri: " + uri)
         const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
         alert("uploadUri: " + uri)
         let uploadBlob = null
         const imageRef = getStorage().ref('photos').child(imageName)
         fs.readFile(uploadUri, 'base64')
             .then((data) => {
               alert(" 2 ")
                return Blob.build(data, {type: `${mime};BASE64`})
             })
             .then((blob) => {
                alert(" 3 ")
                uploadBlob = blob
                return imageRef.put(blob, {contentType: mime})
             })
             .then(() => {
               alert(" 4 ")
               uploadBlob.close()
               return imageRef.getDownloadURL()
             })
             .then((url) => {
               alert(" 5 ")
               resolve(url)
             })
             .catch((error) => {
               alert(" 6 ")
               reject(error)
             })
      })
   }

  /*async componentWillMount () {
     try{
       //let user = await firebase.auth().getUser();
       this.setState({
         uid: getUser()
       })
     } catch(error){
       console.log(error)
     }
   }*/

   openImagePicker(){
     var options = {
       title: 'Select Avatar',
       storageOptions: {
         skipBackup: true,
         path: 'photos'
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
           imageHeight: response.height,
           imageWidth: response.width,
           uid: getUser()
         })
       }
     })
   }

   addImage(){
     if(this.state.uid){
         try{
            this.state.imagePath ?
                this.uploadImage(this.state.imagePath, `${this.state.uid}.jpg`)
                    .then((responseData) => {
                      Helper.setImageUrl(this.state.uid, responseData)
                    })
                    .done()
                : null
         } catch(error){
           console.log(error)
         }
     }
   }

  render(){
    return (
        <View>
            {this.state.imagePath ? <Image style={{width: 300, height: 300}} source={{uri: this.state.imagePath}} /> : null}
            <Icon
                  reverse
                  name='camera-enhance'
                  color='#517fa4'
                  onPress={this.openImagePicker.bind(this)}
              />
            <Button
              title="save"
              onPress={this.addImage.bind(this)}>
            </Button>
        </View>
  )}

}

module.export = CameraComponent;
