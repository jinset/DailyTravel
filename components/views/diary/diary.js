import {
  AppRegistry, TextInput, View, TouchableHighlight, ToolbarAndroid,
   ActivityIndicator, Alert,Image, Dimensions } from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Item, Input,Fab, Label,Title ,Toast, Button,Text,Body, Right, Switch, Icon, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge  } from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import * as firebase from 'firebase'
var idOwner, name, description, culture, url

export default class DiaryView extends Component {

static navigationOptions = ({ navigation }) => ({
    header: null,
    title: strings.diary,
  });
  constructor(props) {
    super(props);
    this.state = {
      active: 'false',
    };

    try{
      const { params } = this.props.navigation.state;
        let ref = "/diary/"+ params.diaryKey
        firebase.database().ref(ref).on('value', (snap) => {
          if(snap.val()){
              url= snap.val().url,
              idOwner=snap.val().idOwner,
              name= snap.val().name, 
              description= snap.val().description

           }
           if(snap.val().culture){
              culture= strings.culture +": "+ snap.val().culture
           }
        });
      }catch(error){
         {/* Toast.show({
              text: strings.error,
              position: 'bottom',
              buttonText: 'Okay'
            })*/}
           const { navigate } = this.props.navigation;
           navigate('profile');
        }
  }
  render() {
        const { navigate } = this.props.navigation; 
        const { params } = this.props.navigation.state;
    return (

         <Container>
        <Content>
          <Card style={{flex: 0}}>
                <Image source={{uri: url}} 
                style={{height: 100, width: Dimensions.get('window').width}}/>
            <CardItem>
              <Left>
                  <Text style={{fontWeight: 'bold',fontSize: 18}}>{name}</Text>
              </Left>
              <Right>
                <Button transparent textStyle={{color: '#87838B'}}
                 onPress={() => navigate('editDiary', {diaryKey:params.diaryKey})}>
                 
                  <Text>Editar</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>{description}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>{culture}</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
