import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Item, Input, Label, Button,Text,Body,CheckBox , Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../common/local_strings.js'
import FooterNav from  '../common/footerNav.js'
import { getDatabase } from '../common/database';
import  DailyList  from './dailyList';

 export default class NewDiary extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',      
      status:'',
      privacy: false,
      date:'',
      description: '',
      culture: '',

    }
  }
  privacyChange(){
    this.setState( {privacy: !this.state.privacy})
  }
  add(){
     getDatabase().ref().child('dairies/').push().set({
     diary: {
       name:this.state.name,
       status:this.state.status,
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,
       date:this.state.date,

     }
   });
}
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title:strings.dairy,
  };
  render() {
    return (

        <Container>
          <Content>
            <Form>
                <Right>
                 <Label>{strings.privacy }</Label>
                  <Switch
                  value={ this.state.privacy }
                    onValueChange={this.privacyChange.bind( this ) }/>
                </Right>
              <Item floatingLabel>
                  <Label>{strings.name }</Label>
                <Input onChangeText={(text) => this.setState({name:text})}
                returnKeyLabel = {"next"} />
              </Item>
              <Item floatingLabel>
                  <Label>{strings.description }</Label>
                <Input onChangeText={(text) => this.setState({description:text})}
                returnKeyLabel = {"next"}/>
              </Item>
              <Item floatingLabel>
                  <Label>{strings.culture }</Label>
                <Input onChangeText={(text) => this.setState({culture:text})}
                returnKeyLabel = {"next"} />
              </Item>
              <Item >
            <Button iconRight  rounded info>
              <Icon name='add' />
              <Text>{strings.daily }</Text>
            </Button>
              </Item>
              <Button block
               onPress={() => this.add()}>
               <Text>{strings.save }</Text>
              </Button>
            </Form>
          </Content>
        </Container>

    );
  }
}
