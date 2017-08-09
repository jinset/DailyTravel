import { TouchableHighlight, Alert ,Dimensions,Platform,Image,AsyncStorage,ListView,
TouchableOpacity, } from 'react-native';
import React, {Component} from 'react';
import { Container, Content, Form,List,Toast,ListItem,Radio, Item, Input,View, Label, Button ,Text,Body , Right, Switch, Card,
   CardItem, Thumbnail, Left  } from 'native-base';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import HideableView from 'react-native-hideable-view';
//Firebase
import { getDatabase } from '../../common/database';
import * as firebase from 'firebase';


var newRef ='';
var usuario ='';
 export default class Guest extends Component {

///////////////////////////////////////// addGuest /////////////////////////////////////////////////////////////
    addGuest(i){
      var diaryUsers =[];
      diaryUsers=this.state.diaryUsers;
      diaryUsers.push({
        id:this.state.users[i].id,
        nickname: this.state.users[i].nickname,
        name: this.state.users[i].name,
        lastName: this.state.users[i].lastName,
        url: this.state.users[i].url,
        invited: !this.state.users[i].invited,
      });//users.push

      var users = [];
      users=this.state.users;
      users.splice(i, 1);
      this.setState({
          users: users,
          diaryUsers:diaryUsers,
      })//users.push
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// removeGuest /////////////////////////////////////////////////////////////
    removeGuest(i){
      if(this.state.uidCurrentUser != this.state.diaryUsers[i].id){
        var users =[];
        users=this.state.users;
        users.push({
          id:this.state.diaryUsers[i].id,
          nickname: this.state.diaryUsers[i].nickname,
          name: this.state.diaryUsers[i].name,
          lastName: this.state.diaryUsers[i].lastName,
          url: this.state.diaryUsers[i].url,
          invited: !this.state.diaryUsers[i].invited,
        });//users.push

        var diaryUsers = [];
        diaryUsers=this.state.diaryUsers;
        diaryUsers.splice(i, 1);
        this.setState({
            users: users,
            diaryUsers:diaryUsers,
        })//users.push
    }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: strings.guest,
    headerStyle: {height: 50 },
    headerTitleStyle : {color:'#808080',fontSize:17},
  }
  render() {  const { navigate } = this.props.navigation;

    let listTable = this.state.users.map((u,i) => {
      return (
          <ListItem avatar>
            <Left>
              <Thumbnail small source={{uri: u.url}}   />
            </Left>
            <Body>
              <Text>{u.nickname}</Text>
            </Body>

          <Right>
            <Radio selected={u.invited} onPress={() => this.addGuest(i)} />
          </Right>
          </ListItem>
            )
      });
      let listTable2 = this.state.diaryUsers.map((u,i) => {
        return (
            <ListItem avatar>
              <Left>
                <Thumbnail small source={{uri: u.url}}   />
              </Left>
              <Body>
                <Text>{u.nickname}</Text>
              </Body>

            <Right>
              <Radio selected={u.invited} onPress={() => this.removeGuest(i)} />
            </Right>
            </ListItem>
              )
        });
    return (
        <Container>
            <View>
              <List>
              <ListItem itemDivider>
               <Text>Invitados</Text>
             </ListItem>
                  {listTable2}
                  <ListItem itemDivider>
               <Text>Amigos</Text>
             </ListItem>
             {listTable}
              </List>
            </View>
                <Button full dark style= {{backgroundColor: '#41BEB6'}}
         onPress={() => this.add()} >
         <Text>{strings.save }</Text>
        </Button>

        </Container>
    );
  }
}

}
