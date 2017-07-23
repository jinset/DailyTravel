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

import { Container, Content, Button, Text, Input,Item,Label, Form } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';

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
    title: strings.daily,
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
 };

  addDaily(){
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;
    let idDiary = params.diaryKey;
    getDatabase().ref().child('/diary/'+idDiary+"/daily/").push({
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
        <Form>

            <Item stackedLabel>
              <Label>{strings.name }</Label>
              <Input
                onChangeText={(text) => this.setState({name:text})}
              />
            </Item >

            <DatePicker
                iconComponent={<Icon active name='date-range' style={{position: 'absolute', left: 5, top: 5, marginLeft: 0}}/>}
                style={{width: 150, margin:10}}
                date={Moment(this.state.date, 'MM/DD/YY')}
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
                onChangeText={(text) => this.setState({experience:text})}
              />



              <Label>{strings.tips }</Label>
              <AutogrowInput
                style={{minHeight:Dimensions.get('window').height/5, fontSize: 18}}
                onChangeText={(text) => this.setState({tips:text})}
              />

          </Form>
        </Content>

          <Button full light style= {{backgroundColor: '#D3D0CB'}}
              onPress={this.addDaily.bind(this)}>
              <Text>{strings.save}</Text>
          </Button>

      </Container>
    );
  }
}


AppRegistry.registerComponent('CreateDaily', () => CreateDaily);

module.export='CreateDaily';
