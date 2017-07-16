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
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

export default class CreateDaily extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      name: null,
      experience: null,
      tips: null,
      date: new Date().toLocaleDateString(),
      dataSource: ds.cloneWithRows([null]),
    };
  }

  static navigationOptions = {
   title: "Daily",
 };

  onPressAddDaily(){
    const { goBack } = this.props.navigation;
    getDatabase().ref().child('daily/').push({
      name: this.state.name,
      date: this.state.date,
      experience: this.state.experience,
      tips: this.state.tips,
    });
    goBack();
  }

  render() {
    return(
      <Container>
        <Content>
          <Text>Daily name:</Text>
          <Input
            onChangeText={(text) => this.setState({name:text})}
          />

          <DatePicker
            style={{width: 150}}
               date={Moment(this.state.date, 'MM/DD/YY')}
               mode="date"
               placeholder="select date"
               format="MM/DD/YY"
               //minDate="2016-05-01"
               //maxDate="2016-05-01"
               confirmBtnText="Confirm"
               cancelBtnText="Cancel"
               customStyles={{
                 dateIcon: {
                     position: 'absolute',
                     left: 0,
                     top: 4,
                   marginLeft: 0
                 },
               dateInput: {
                   marginLeft: 36
               }
             }}
             onDateChange={(date) => {this.setState({date: date})}}
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
          <Text>Agregar</Text>
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
