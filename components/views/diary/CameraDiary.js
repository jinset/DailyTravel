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
  TouchableHighlight,
} from 'react-native';
import { Container, Content, Form, Item, Input, Label,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge  } from 'native-base';
import HelperDiary from './helperDiary';
import { Icon } from 'react-native-elements';
import { getDatabase } from '../../common/database';
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
         const imageRef = firebase.storage().ref('images/diary').child(imageName)
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
        key: '',
        imagePath:'',
      }
   }

  async componentWillMount () {
     try{
       let key = "-KouQwXlWVRwyeIDdwdj";
       HelperDiary.getImageUrl(key, (url) => {
         this.setState({
           imagePath: url,
         })
       })
       this.setState({
         key: key,
       })
     } catch(error){
       console.log(error)
     }
   }

   openImagePicker(){
     var options = {
       title: 'Select Avatar',
       storageOptions: {
         skipBackup: true,
         path: 'images/diary'
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
       }
       if(this.state.key){
           try{
              this.state.imagePath ?
                  uploadImage(this.state.imagePath, `${this.state.key}.jpg`)
                      .then((responseData) => {
                        HelperDiary.setImageUrl(this.state.key, responseData)
                      })
                      .done()
                  : null
           } catch(error){
             alert(error)
           }
       }
     })
   }

  render(){
    return (
        <View>
            <TouchableHighlight onPress={this.openImagePicker.bind(this)}>
              <Thumbnail
                large  style={{ alignSelf: "center" }}
                source={{uri: this.state.imagePath}}
              />
            </TouchableHighlight>
           {/* <TouchableHighlight  onPress={this.openImagePicker.bind(this)}>
               <Card>
                <CardItem cardBody>
                  <Image source={{uri: this.state.imagePath}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
              </Card>
            </TouchableHighlight>*/}
      </View>
  )}

}

module.export = CameraComponent;
