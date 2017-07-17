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
import Accordion from 'react-native-accordion';

export default class EditProfile extends Component {

   constructor(props) {
       super(props);
       this.state = {
         inputNickname: '',
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
          inputNickname: params.nickname,
          inputName: params.userName,
          inputLastName: params.lastName,
          inputEmail: params.email,
        })
      } catch(error){
        alert("error: " + error)
      }
    }

   save(){
     const {goBack} = this.props.navigation;
     try{
       if(this.state.inputNickname && this.state.inputEmail){
         Helper.setUserNickname("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputNickname)
         Helper.setUserName("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputName)
         Helper.setUserLastName("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputLastName)
         Helper.setUserEmail("0OzwjYU9g4MRuxwQYlH1UQcKcyC3", this.state.inputEmail)
       }
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
                            <Input placeholder={params.nickname}
                                   onChangeText={(text) => this.setState({inputNickname: text})}
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
                        <Accordion
                          header={
                            <View style={styles.row}>
                                    <Icon active name='cake' />
                                    <Label>Cumpleaños</Label>
                            </View>
                          }
                          content={
                            <View>
                                <Icon active name='cake' />
                                <Input placeholder='  Cumpleaños'/>
                            </View>
                          }
                          easing="easeOutCubic"
                        />
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
                    <Button full
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
  },
  row: {
    flexDirection: 'row',
  },
});
