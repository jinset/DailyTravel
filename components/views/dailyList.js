import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  ScrollView,
  Text,
  TextInput,
  Image,
  Dimensions,
  Button,
} from 'react-native';

import * as firebase from 'firebase';
import { StackNavigator } from 'react-navigation';

  export default class DailyList extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      name: null,
      experience: null,
      tips: null,
      dataSource: ds.cloneWithRows([null]),
    }
  }
  onPressAddDaily(){
    alert(this.state.name);
    firebaseApp.database().ref().child('daily/').push({
      name: this.state.name,
      experience: 'explicacion de 5 parrafos',
      tips: 'recomendaciones',
    });
    alert(this.state.name);
  }

    static navigationOptions = {
      header: null,
      title: 'Welcome',
    };
  render() {
  //  const { navigate } = this.props.navigation;
  return (
    <View>
      <Text>Aqui para ingresar </Text>
      <Button block light
      onPress={() => navigate('AddDaily', { user: 'Lucy' })}
  title="Registrarme"
       />

      </View>
    );
  }
}


 class AddNewDaily extends Component{
  static navigationOptions = {
    header: null,
    title: 'Daily',
  };

  addNewDaily(){
    alert('Hola mundo ya entre');
  }

  render() {
    return (
      <View>
        <Button
          onPress={() => this.addNewDaily()}
          title="Show alert"
             />
      </View>
    );
  }
}
