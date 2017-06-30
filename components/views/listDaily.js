import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  ListView,
  Image,
  Dimensions,
  Button,
} from 'react-native';



export default class ListDaily extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      name: null,
      dataSource: ds.cloneWithRows([null]),
    };
  }

  onPressAddDaily(){
    alert(this.state.name);
    firebaseApp.database().ref().child('daily/').push({
      name: this.state.name,
      experience: this.state.experience,
      tips: this.state.tips,
    });
  }

  render() {
    return(


    <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <Text>{rowData}</Text>}
    />

    );
  }
}

const styles = StyleSheet.create({
  littleComponent:{
    flexDirection: 'row',
    marginBottom: 10,
  },
  addDailyForm:{
    flexDirection: 'column',
  },
  addButton:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  }
});

AppRegistry.registerComponent('ListDaily', () => ListDaily);

module.export='ListDaily';
