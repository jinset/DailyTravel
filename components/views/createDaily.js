import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  ListView,
  Image,
  Dimensions,
} from 'react-native';

import { Container, Content, Button, Text, Input } from 'native-base';
import { getDatabase } from '../common/database';

export default class CreateDaily extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      name: null,
      experience: null,
      tips: null,
      dataSource: ds.cloneWithRows([null]),
    };
  }

  onPressAddDaily(){
    alert(this.state.name);
    getDatabase().ref().child('daily/').push({
      name: this.state.name,
      experience: this.state.experience,
      tips: this.state.tips,
    });
  }

  render() {
    return(
      <Container>
        <Content>
          <Text>Daily name:</Text>
          <Input
            onChangeText={(text) => this.setState({name:text})}
          />

          <Text>My experience:</Text>
          <Input
            onChangeText={(text) => this.setState({experience:text})}
          />

          <Text>Tips:</Text>
          <Input
            onChangeText={(text) => this.setState({tips:text})}
          />

          <Button block success
              onPress={this.onPressAddDaily.bind(this)}>
          <Text>patiyo</Text>
          </Button>
        </Content>
      </Container>
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

AppRegistry.registerComponent('CreateDaily', () => CreateDaily);

module.export='CreateDaily';
