import {
  AppRegistry,
  Image,
  ListView,

} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {  Container, Content, Card, CardItem, Thumbnail, Text, Button,View,Fab, Left,Right, Body,Drawer} from 'native-base';
import { ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';

 export default class Home extends Component {

   constructor(props) {
     super(props);
     console.disableYellowBox = true;
     this.state = {
       dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2,
       }),
       showSpinner: false

     };
   }
    static navigationOptions = {
        title: strings.home,
        header: null,
    }

    /*
      Obtiene los diarios que su privacidad esten en falsos
     */
    async getDiaries() {
      return new Promise((resolve, reject) => {
        var url = getDatabase().ref('diary').orderByChild("privacy").equalTo(false);
        url.on('value', (snap) => {
          var diaries = [];
          snap.forEach((child) => {
            diaries.push({
              _key: child.key,
              name: child.val().name,
              description: child.val().description,
              url: child.val().url,
              idOwner: child.val().idOwner
            });
          });
          resolve(diaries)
        })
      })
    }
    /*
      Obtiene el usuario y arma un objeto con el usuario + diario donde retorna ese objeto
     */
    async getUser(dataUser) {
      return new Promise((resolve, reject) => {
        var diaries = [];
        var ref = getDatabase().ref("users/" + dataUser.idOwner);
        ref.once("value", (snapshot) => {
          var val = snapshot.val();
          diaries = {
            _key: dataUser._key,
            name: dataUser.name,
            description: dataUser.description,
            url: dataUser.url,
            idOwner: dataUser.idOwner,
            userNick: val.nickname,
            photoUser: val.url
          }
          console.log(diaries);
          resolve(diaries);
        })
      });
    };

  async componentDidMount() {
    try {
      let homeArray = [];
      console.log('First');
      let array = await this.getDiaries();
      console.log(array);
      for (var i in array) {
        await this.getUser(array[i]).then(data => {
          homeArray.push(data)
        });
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(homeArray)
      });
      console.log('End');
    } catch (error) {
      console.log(error.message);
    }

  }
  _renderItem(item) {
    return (
      <Card style={{flex: 0}} key={item._key}>
      <CardItem >
        <Left>
          <Thumbnail source={{uri: item.photoUser}} />
          <Body>
            <Text>{item.userNick}</Text>
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
           <Text>{item.name}</Text>
      </CardItem>
      </Card>

    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
         <Content>
         { this.state.showSpinner ? <Spinner /> : null }

           <ListView
             dataSource={this.state.dataSource}
             renderRow={this._renderItem.bind(this)}
             enableEmptySections={true}>
           </ListView>
         </Content>

         <View>
           <Fab
             active='false'
             direction="up"
             containerStyle={{ }}
             style={{  backgroundColor:'#41BEB6'}}
             position="bottomRight"
             onPress={()=> navigate('newDiary')}>
             <Icon color='white' name="library-books" />
           </Fab>
         </View>
       </Container>
    );
  }
}
