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
  Text,
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Segment, Item, Separator, Input, Label, Button,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import Helper from './helper';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';

let diarys = [{id: null, name: null, description: null, url: null}]

export default class Profile extends Component {
   constructor(props) {
       super(props);
       console.disableYellowBox = true;
       this.state = {
         uid: '',
         userName: '',
         lastName: '',
         email: '',
         nickname: '',
         imagePath: '',
         birthday: '',
         diarys: diarys,
       }
    }

    static navigationOptions = {
      title: strings.profile,
      headerStyle: {backgroundColor: '#70041b',height: 50 },
      headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
    }
    logout() {
      const { navigate } = this.props.navigation;

      AsyncStorage.removeItem("user");
      navigate('login');
    }
    async componentDidMount(){
     try{
       AsyncStorage.getItem("user").then((value) => {
             this.setState({
               uid: value
             })
             Helper.getUserName(this.state.uid, (name) => {
               this.setState({
                 userName: name,
               })
             })
             Helper.getUserNickname(this.state.uid, (nickname) => {
              this.setState({
                  nickname: nickname,
               })
            })
            Helper.getUserLastName(this.state.uid, (lastname) => {
              this.setState({
                lastName: lastname,
              })
            })
            Helper.getUserEmail(this.state.uid, (email) => {
              this.setState({
                email: email,
              })
            })
            Helper.getImageUrl(this.state.uid, (url) => {
              this.setState({
                imagePath: url,
              })
            })
            Helper.getUserBirthDay(this.state.uid, (birthday) => {
              this.setState({
                birthday: birthday,
              })
            })
            Helper.getDairysByUser(this.state.uid, (d) => {
             this.setState({
                 diarys: d,
              })
            })
       })
     } catch(error){
       alert("error: " + error)
     }
   }

  render() {

    const { navigate } = this.props.navigation;

    let listTable = this.state.diarys.map((d,i) => {
        return (
                <ScrollView>
                    <CardItem key={i}>
                    <TouchableHighlight onPress={() => navigate('DairyView', {diaryKey:d.id})}>
                        <Body>
                          <View style={styles.row}>
                              <Thumbnail
                                small
                                source={{uri: this.state.imagePath}}
                              />
                            <View style={styles.center}>
                                  <Text style={styles.diary}>{"    " +d.name} </Text>
                              </View>
                              <Right>
                                  <Icon active name='more-vert' />
                              </Right>
                          </View>
                          <Left>
                              <Image
                                source={{uri: d.url}}
                                style={{height: 300, width: Dimensions.get('window').width}}
                              />
                              <Text style={styles.description}> {d.description} </Text>
                          </Left>
                        </Body>
                        </TouchableHighlight>
                    </CardItem>
                    <Separator></Separator>
                </ScrollView>
              )
      });

    return (
          <Container>
            <Content>
              <Card fixed>
                <CardItem>
                  <Left>
                    <View style={styles.column}>
                        <CameraComponent />
                            {this.state.nickname ?
                              <Text style={styles.nick}>{this.state.nickname}</Text>
                              : null
                            }
                            {/*{this.state.userName && this.state.lastName ?
                              <Text>{this.state.userName} {this.state.lastName}</Text>
                              : null
                            } */}
                    </View>
                 </Left>
                    <Button transparent small
                            onPress={()=>navigate('editProfile', {uid: this.state.uid,
                                                                  nickname: this.state.nickname,
                                                                  userName: this.state.userName,
                                                                  lastName: this.state.lastName,
                                                                  email: this.state.email,
                                                                  birthday: this.state.birthday,
                                                                })}>
                        <Icon active name='mode-edit' />
                    </Button>

                </CardItem>
              </Card>
              <Card>
                    {listTable}
               </Card>
               <Button block info onPress = {this.logout.bind(this)} style={{marginTop:15}}>
                  <Text style={{color:'white'}}>logout</Text>
               </Button>
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
  center: {
      alignItems: 'center',
      flexDirection: 'row',
  },
  privateInfo: {
    paddingTop: 15,
  },
  title: {
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  nick: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000000',
  },
  diary: {
    fontStyle: 'italic',
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold',
  },
  description: {
    fontStyle: 'italic',
    textAlign: 'justify',
    fontSize: 14,
    textDecorationStyle: 'solid',
    color: '#000000',
    paddingLeft: 5,
  }
});
