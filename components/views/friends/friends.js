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
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Header, Form, Segment, Item, Separator, Input, Label, Button,Body, Right, Switch, Card, CardItem, Thumbnail, Left, Footer, FooterTab, Badge, List, ListItem} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';
import CameraComponent from '../cameraComponent/CameraComponent';
import * as firebase from 'firebase';
import {getAuth} from '../../common/database';
import { Icon } from 'react-native-elements';

export default class Profile extends Component {

  static navigationOptions = {
    title: "Friends",
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  }

   constructor(props) {
       super(props);
       this.state = {
         uid: '',
         inputSearch: '',
         users: [],
       }
    }

    search(text){
      if(text != ''){
        let ref = getDatabase().ref("/users")
        userList = (ref.orderByChild("nickname").startAt(text).endAt(text+'\uf8ff'))
        userList.on('value', (snap) => {
            var users = [];
            snap.forEach((child) => {
                users.push({
                  id: child.key,
                  nickname: child.val().nickname,
                  name: child.val().name,
                  lastName: child.val().lastName,
                  url: child.val().url,
                });//users.push
            });//snap.forEach
            this.setState({
              users: users,
            })
        })//userList.on
      }/*if text has content*/else{
        this.setState({
          users: [],
        })
      }//else
    }//search

  render() {
    const { navigate } = this.props.navigation;

    let listTable = this.state.users.map((u,i) => {
      return (
                    <ListItem>
                          <Thumbnail
                            small
                            source={{uri: u.url}}
                          />
                        <Text style={styles.nick}>{u.nickname}</Text>
                        <Text>{u.name} {u.lastName}</Text>
                    </ListItem>
            )
      });

    return (
          <Container>
              <Content>
                    <Header style={{backgroundColor: 'white'}} searchBar rounded>
                          <Item>
                            <Icon name="search" />
                            <Input placeholder="Search"
                                   maxLength = {20}
                                   onChangeText={(text) => this.search(text)}
                            />
                            <Icon name="people" />
                          </Item>
                          <Button transparent>
                            <Text>Search</Text>
                          </Button>
                    </Header>
                    <Body>
                      <List>
                          {listTable}
                      </List>
                    </Body>
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
    padding: 15,
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
