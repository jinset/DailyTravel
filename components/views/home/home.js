import {
  AppRegistry,
  Image,
  ListView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {  Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left,Right, Body} from 'native-base';
import { ListItem } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import { createNotification } from '../../common/notification';


 export default class Home extends Component {

   constructor(props) {
     super(props);
     console.disableYellowBox = true;
     this.state = {
       dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2,
       }),
       visible: false,
       userId: "",
       currentPageIndex : 1
     };
   }
    static navigationOptions = {
        title: strings.home,
        header: null,
    }

    /*async getUserLogin(idUser) {
      return new Promise((resolve, reject) => {
        var diaries = [];
        var ref = getDatabase().ref("users/" + idUser);
        ref.once("value", (snapshot) => {
          var val = snapshot.val();
          resolve(val);
        })
      });
    };*/

    /*
      Obtiene los diarios que su privacidad esten en falsos
     */
    async getDiaries(current) {
      return new Promise((resolve, reject) => {
        var pageSize = current * 10;
        console.log(pageSize);
        var url = getDatabase().ref('diary').limitToLast(pageSize).orderByChild("privacy").equalTo(false);
        url.on('value', (snap) => {
          var diaries = [];
          snap.forEach((child) => {
            if (child.val().status === true) {
              diaries.push({
                _key: child.key,
                name: child.val().name,
                description: child.val().description,
                url: child.val().url,
                idOwner: child.val().idOwner
              });
            }
          });
          resolve(diaries.reverse())
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
      /*Muestra el loading*/
      //createNotification('userIdGet','userSend','type','date');
      this.setState({
        visible: !this.state.visible
      });
      let array = await this.getDiaries(this.state.currentPageIndex);
      console.log(array);
      for (var i in array) {
        await this.getUser(array[i]).then(data => {
          homeArray.push(data)
        });
      }
      /*Carga el home en el dataSource*/
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(homeArray)
      });
      /*Desaparece el loading*/
     this.setState({
        visible: !this.state.visible
      });
    } catch (error) {
      console.log(error.message);
    }

  }
async load() {
  try {
    var current = this.state.currentPageIndex;
    current = current +1;
    this.setState({
      currentPageIndex: current
    });
    console.log(this.state.currentPageIndex);
    let homeArray = [];
    /*Muestra el loading*/
    //createNotification('userIdGet','userSend','type','date');
    this.setState({
      visible: !this.state.visible
    });
    let array = await this.getDiaries(current);
    console.log(array);
    for (var i in array) {
      await this.getUser(array[i]).then(data => {
        homeArray.push(data)
      });
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(homeArray)
    });
    /*Desaparece el loading*/
    this.setState({
      visible: !this.state.visible
    });
  } catch (error) {
    console.log(error.message);
  }

}

  _renderItem(item) {
    const { navigate } = this.props.navigation;
    return (
      <Card style={{flex: 0}} key={item._key}>
      <CardItem >
        <Left>
        <TouchableHighlight onPress={() => navigate('DairyView', {diaryKey:item._key})}>
          <Thumbnail source={{uri: item.photoUser}}/>
          </TouchableHighlight>
          <Body>
            <Text>{item.userNick}</Text>
            <Text note>April 15, 2016</Text>
          </Body>
        </Left>
        <Right>
            <Icon active name='more-vert' />
        </Right>
      </CardItem>
      <TouchableHighlight onPress={() => navigate('DairyView', {diaryKey:item._key})}>
      <CardItem >
        <Body style={{alignItems:'center'}} >
          <Image source={{uri: item.url}}
            style={{height: 300, width: Dimensions.get('window').width}}
          />
          <Text>
            {item.description}
          </Text>
        </Body>
      </CardItem>
      </TouchableHighlight>

      <CardItem>
           <Text>{item.name}</Text>
      </CardItem>
      </Card>

    );
  }


  render() {
    return (
      <Container>
         <Content>
         <Spinner visible={this.state.visible} overlayColor={{color:'rgba(0, 0, 0, 0)'}} textContent={strings.loading} textStyle={{color: '#70041b'}} />

           <ListView
             dataSource={this.state.dataSource}
             renderRow={this._renderItem.bind(this)}
             enableEmptySections={true}>
           </ListView>

           <Button block info onPress = {this.load.bind(this)} style={{marginTop:15,backgroundColor: '#70041b'}}>
              <Text style={{color:'white'}}>{strings.seeMore}</Text>
           </Button>
         </Content>

       </Container>
    );
  }
}
