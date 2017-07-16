import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert,Image 
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Item, Input,Fab, Label,Title , Button,Text,Body, Right, Switch, Icon, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import * as firebase from 'firebase'
let url = ''
 export default class DiaryView extends Component {

static navigationOptions = ({ navigation }) => ({
    header: null,
    title: strings.diary,
  });
  constructor(props) {
    super(props);
    this.state = {
      active: 'false',
      idOwner:'',
      name: '', 
      description: '',
      culture: '',
      url:'',
    };

    try{
      const { params } = this.props.navigation.state;
        let ref = "/diary/"+ "-KoQBCFvwU8kY8XL3Ioa"
        firebase.database().ref(ref).on('value', (snap) => {
          if(snap.val()){
            this.setState({
              url: snap.val().url,
              idOwner:snap.val().idOwner,
              name: snap.val().name, 
              description: snap.val().description,
              culture: snap.val().culture,
            });
            alert(this.state.name);
           }
        });
      }catch(error){
          Toast.show({
              text: strings.wrongPassEmail,
              position: 'bottom',
              buttonText: 'Okay'
            })
           const { navigate } = this.props.navigation;
           navigate('profile');
        }
  }
  render() {
        //const { navigate } = this.props.navigation;
  
    return (

         <Container>
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Body>
                <Image source={{uri: this.state.url}} style={{height: 100, width: 290, flex: 1}}/>
                </Body>
            </CardItem>

            <CardItem>
              <Left>
                  <Text>{this.state.name}</Text>
              </Left>
              <Right>
                <Button transparent textStyle={{color: '#87838B'}}>
                 
                  <Text>Editar</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>{this.state.description}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
              <Text large >{strings.culture}</Text >
                <Text>{this.state.culture}</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
