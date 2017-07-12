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
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
import { getDatabase } from '../common/database'

export default class CameraComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        imagePath: '',
        imageHeight: '',
        imageWidth: ''
      }
   }

   openImagePicker(){
     var options = {
       title: 'Select Avatar',
       storageOptions: {
         skipBackup: true,
         path: 'images'
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
           imageWidth: response.width
         })
         this.addImage(response)
       }
     })
   }

   addImage(response){
     getDatabase().ref().child('daily/').push({
          photo: response.uri
    });
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
        </View>
  )}

}

module.export = CameraComponent;
