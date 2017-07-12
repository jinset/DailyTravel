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
import { Container, Content, Form, Item, Input, Label, Button ,Text,Body,CheckBox ,ActionSheet, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../../common/local_strings.js';
import FooterNav from  '../../common/footerNav.js';
import { getDatabase } from '../../common/database';
import  CreateDaily  from '../daily/createDaily.js';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { DialogTitle } from 'react-native-popup-dialog';
var BUTTONS = [
  'Option 0',
  'Option 1',
  'Option 2',
  'Delete',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;
 export default class NewDiary extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      status: true,
      privacy: false,
      date:'',
      description: '',
      culture: '',

    }
  }
  privacyChange(){
    this.setState( {privacy: !this.state.privacy})
  }
       // status:this.state.status,
       // date:this.state.date,
  add(){
     getDatabase().ref().child('dairies/').push().set({
     diary: {
       name:this.state.name,
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,
       status:this.state.status,
     }
   }).catch(function(error) {
       alert(error);
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
               <Button rounded light>
                  <Icon name='people' />
                  <Text>{strings.guest }</Text>
                </Button>

                <Button rounded light
                onPress={() => {this.popupDialog.show(); }}>
                  <Icon name='calendar' />
                  <Text>{strings.daily }</Text>
                </Button>
            </Form>
        </Content>
            <Button full
             onPress={() => this.add()}>
             <Text>{strings.save }</Text>
            </Button>

         <PopupDialog dialogTitle={<DialogTitle title={strings.daily } />}
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            dialogAnimation = { new SlideAnimation({ slideFrom: 'bottom' }) }
          >
            <Container>
             <CreateDaily></CreateDaily>
            </Container>
        </PopupDialog>
      </Container>


    );
  }
}
