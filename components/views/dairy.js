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
import { Container, Content, Form, Item, Input, Label, Button,Text,Body, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../common/local_strings.js'
import FooterNav from  '../common/footerNav.js'

 export default class DairyView extends Component {

   static navigationOptions = {
    header: null,
    title: strings.dairy,
  };

  render() {
        const { navigate } = this.props.navigation;
    return (

         <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'http://concepto.de/wp-content/uploads/2015/03/Paisaje.jpg'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>GeekyAnts</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Button transparent>
                <Icon active name="thumbs-up" />
                <Text>12 Likes</Text>
              </Button>
              <Button transparent>
                <Icon active name="chatbubbles" />
                <Text>4 Comments</Text>
              </Button>
              <Text>11h ago</Text>
            </CardItem>
          </Card>

        </Content>
        <FooterNav></FooterNav>
      </Container>
    );
  }
}


 class NewDiary extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      description: '',
        culture: '',
        privacy: ''
    }
  }
  add(){
     firebaseApp.database().ref().child('dairies/').push().set({
     dahhiry: {
       name:this.state.name,
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,

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
              <Item stackedLabel>
              <Text>{strings.name }</Text>
                <Input onChangeText={(text) => this.setState({name:text})}
                returnKeyLabel = {"next"} />
              </Item>
              <Item stackedLabel >
              <Text>{strings.description }</Text>
                <Input onChangeText={(text) => this.setState({description:text})}
                returnKeyLabel = {"next"}/>
              </Item>
              <Item stackedLabel last>
              <Text>{strings.culture }</Text>
                <Input
                onChangeText={(text) => this.setState({culture:text})}
                returnKeyLabel = {"next"} />
              </Item>
                <Right>

                <Text>{strings.privacy }</Text>
                  <Switch value={true}
                  onChangeText={(text) => this.setState({privacy:text})}
                  returnKeyLabel = {"next"} />
                </Right>

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
