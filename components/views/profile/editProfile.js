import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert,
  ListView,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Segment, Item, Input, Label, Button, Text,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import Helper from './helper';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';

export default class EditProfile extends Component {
  static navigationOptions = {
    title: strings.profile,
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  }
   constructor(props) {
       super(props);
       this.state = {
         inputName: '',
         inputLastName: '',
         inputNickname: '',
         inputEmail: '',
       }
    }

    async componentDidMount(){
      const { params } = this.props.navigation.state;
      try{
        this.setState({
          inputName: params.userName,
          inputLastName: params.lastName,
          inputNickname: '',
          inputEmail: params.email,
        })
      } catch(error){
        alert("error: " + error)
      }
    }

   save(){
     const {goBack} = this.props.navigation;
     try{
       Helper.setUserName("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputName)
       Helper.setUserLastName("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputLastName)
       Helper.setUserEmail("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputEmail)
       goBack()
     } catch(error){
       alert("error: " + error)
     }
   }

  render() {
    const { params } = this.props.navigation.state;
    return (
          <Container>
            <Content>
              <Form>
               <View style={styles.centerCamera}>
                    <CameraComponent />
                    <Text>Cambiar foto de perfil</Text>
               </View>
                <Card>
                        <Item >
                            <Icon active name='loyalty' />
                            <Input placeholder='Nick'
                                   maxLength = {20} />
                        </Item>
                        <Item >
                            <Icon active name='person' />
                            <Input placeholder={params.userName}
                                   onChangeText={(text) => this.setState({inputName: text})}
                                   maxLength = {20} />
                        </Item>
                        <Item >
                            <Icon active name='person' />
                            <Input placeholder={params.lastName}
                                   onChangeText={(text) => this.setState({inputLastName: text})}
                                   maxLength = {20}/>
                        </Item>
                        <Item >
                            <Icon active name='cake' />
                            <Input placeholder='  Cumpleaños'/>
                        </Item>
                </Card>
                <Left >
                    <View style={styles.privateInfo}>
                    <Text>
                        Información Privada
                    </Text>
                    </View>
                </Left>
                <Card>
                        <Item >
                            <Icon active name='mail' />
                            <Input placeholder={params.email}
                                   onChangeText={(text) => this.setState({inputEmail: text})}/>
                        </Item>
                        <Item >
                            <Input placeholder='  Cambiar contraseña'
                                   secureTextEntry={true}
                                   maxLength={20} />
                            <Icon active name='keyboard-arrow-down' />
                        </Item>
                </Card>
                <Card>
                    <Button full light style= {{backgroundColor: '#D3D0CB'}}
                            onPress={this.save.bind(this)}>
                        <Text>{strings.save}</Text>
                    </Button>
                </Card>
              </Form>
            </Content>
          </Container>
    );
  }
}

const styles = StyleSheet.create({
  centerCamera: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 15,
  },
  privateInfo: {
    paddingTop: 15,
  },
  title: {
    alignItems: 'center',
  }
});
