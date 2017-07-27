import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Image,
  Dimensions,
  ScrollView,

} from 'react-native';
import { Container, Content, Button, Text, Input, Item, Label, Card, Form } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';

export default class EditDaily extends Component{

  constructor(props){
    super(props);
    const { params } = this.props.navigation.state;
    let idDiary = params.idDiary;
    let idDaily = params.idDaily;
    this.dataRef = getDatabase().ref("/diary/"+idDiary+"/daily/"+idDaily);
    this.dataRef.on('value', (snap) => {
        this.state= {
          idDiary: params.idDiary,
          idDaily: snap.key,
          name: snap.val().name,
          date: snap.val().date,
          experience: snap.val().experience,
          tips: snap.val().tips,
          status: true,
        };
    });
  }

  updateDaily(){
    const { goBack } = this.props.navigation;
    let idDiary = this.state.idDiary;
    let idDaily = this.state.idDaily;
    getDatabase().ref().child('/diary/'+idDiary+'/daily/'+idDaily).set({
      name: this.state.name,
      date: this.state.date,
      experience: this.state.experience,
      tips: this.state.tips,
      status: this.state.status,
    });
    goBack();
  }

  render() {
    return(
      <Container>
        <Content>
        <Form>

            <Item stackedLabel>
              <Label>{strings.name }</Label>
              <Input
                value = {this.state.name}
                onChangeText={(text) => this.setState({name:text})}
              />
            </Item >

            <DatePicker
                iconComponent={<Icon active name='date-range' style={{position: 'absolute', left: 5, top: 5, marginLeft: 0}}/>}
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
                 }}
               onDateChange={(date) => {this.setState({date: date})}}
            />

              <Label>{strings.experiences}</Label>
              <AutogrowInput
                style={{minHeight:Dimensions.get('window').height/5, fontSize: 18}}
                value = {this.state.experience}
                onChangeText={(text) => this.setState({experience:text})}
              />


              <Label>{strings.tips }</Label>
              <AutogrowInput
                style={{minHeight:Dimensions.get('window').height/5, fontSize: 18}}
                value = {this.state.tips}
                onChangeText={(text) => this.setState({tips:text})}
              />

          </Form>
        </Content>

          <Button full light style= {{backgroundColor: '#D3D0CB'}}
              onPress={this.updateDaily.bind(this)}>
              <Text>{strings.save}</Text>
          </Button>

      </Container>
    );
  }
}


AppRegistry.registerComponent('EditDaily', () => EditDaily);

module.export='EditDaily';
