import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Image,
  Dimensions,

} from 'react-native';
import { Container, Content, Button, Text, Input,Item,Label } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import strings from '../../common/local_strings.js';

export default class EditDaily extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      name: null,
      experience: null,
      tips: null,
      date: null,
      dataSource: ds.cloneWithRows([null]),
    };
  }

  async componentDidMount(){
    
  }

  onPressAddDaily(){
    // alert(this.state.name);
    // firebaseApp.database().ref().child('daily/').update({
    //   name: this.state.name,
    //   experience: this.state.experience,
    //   tips: this.state.tips,
    // });
  }

  render() {
    return(
      <Container>
        <Content>
          <Item floatingLabel>
            <Label>{strings.name }</Label>
            <Input
              onChangeText={(text) => this.setState({name:text})}
            />
          </Item >

          <DatePicker
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

          <Item floatingLabel>
            <Label>{strings.experiences }</Label>
            <Input
              onChangeText={(text) => this.setState({experience:text})}
            />
          </Item>

          <Item floatingLabel>
            <Label>{strings.tips }</Label>
            <Input
              onChangeText={(text) => this.setState({tips:text})}
            />
          </Item >

        </Content>

          <Button full light style= {{backgroundColor: '#D3D0CB'}}
              onPress={this.onPressAddDaily.bind(this)}>
              <Text>{strings.save}</Text>
          </Button>

      </Container>
    );
  }
}


AppRegistry.registerComponent('EditDaily', () => EditDaily);

module.export='EditDaily';
