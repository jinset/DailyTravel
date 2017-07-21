import {
  AppRegistry,
  Image,
  ListView,

} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {  Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left,Right, Body,Drawer} from 'native-base';
import { ListItem } from 'react-native-elements';

import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';

 export default class Home extends Component {

   constructor(props) {
     super(props);
     this.dataRef = getDatabase().ref('/diary').orderByChild("privacy").equalTo(false);
     console.disableYellowBox = true;
     this.state = {
       dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2,
       })
     };
   }
    static navigationOptions = {
        title: strings.home,
        header: null,
    }

 async getUser(idOwner) {
    let user = await getDatabase().ref('users/' + idOwner);
    user.once('value').then(function(snap) {
      var val = snapshot.val();
      return val;
    })
  }
  async getDiaryList(dataRef) {
    var diaries = [];
    dataRef.on('value', (snap) => {
      snap.forEach((child) => {
        var user = this.getUser(child.val().idOwner).then((data) => {
          diaries.push({
            _key: child.key,
            name: child.val().name,
            date: child.val().description,
            url: child.val().url,
            user: data.name,
            userPhoto: data.url
          });
        });
      });
    });
  }

  async componentWillMount() {
    this.getDiaryList(this.dataRef);
  }
  _renderItem(item) {
    return (
      <Card style={{flex: 0}} key={item._key}>
      <CardItem >
        <Left>
          <Thumbnail source={item.url} />
          <Body>
            <Text>{item.name}</Text>
            <Text note>April 15, 2016</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem>
        <Body style={{alignItems:'center'}}>
          <Image source={{uri: item.url}} style={{height: 200, width: 200, flex: 1}}/>
          <Text>
            {item.description}
          </Text>
        </Body>
      </CardItem>
      <CardItem>
        <Left>
          <Button transparent textStyle={{color: '#87838B'}}>
          </Button>
        </Left>
        <Right>
          <Button transparent textStyle={{color: '#87838B'}}>
          </Button>
        </Right>
      </CardItem>
      </Card>

    );
  }

  render() {
    return (
      <Container>
         <Content>
           <ListView
             dataSource={this.state.dataSource}
             renderRow={this._renderItem.bind(this)}
             enableEmptySections={true}>
           </ListView>
         </Content>

       </Container>
    );
  }
}
