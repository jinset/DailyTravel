import  React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Image,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Content, Button, Text, Input, Right, Header, Item, Card, CardItem } from 'native-base';
import { ListItem } from 'react-native-elements';
import { getDatabase } from '../../common/database';
import strings from '../../common/local_strings.js';

export default class ListDaily extends Component{

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    let idDiary = params.diaryKey;
    this.dataRef = getDatabase().ref("/diary/"+idDiary+"/daily/").orderByChild("status").equalTo(true);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  static navigationOptions = {
    title: strings.daily,
    headerStyle: {height: 50 },
    headerTitleStyle : {color:'#9A9DA4',fontSize:17},
  }

  getDailyList(dataRef) {
    dataRef.on('value', (snap) => {
      var dailies = [];
      snap.forEach((child) => {
        dailies.push({
          _key: child.key,
          name: child.val().name,
          date: child.val().date,
          experience: child.val().experience,
          tips: child.val().tips,
          url: child.val().url,
          });
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dailies)
      });
    });
  }

  componentDidMount() {
    this.getDailyList(this.dataRef);
  }

  _renderItem(daily) {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <ListItem
        roundAvatar
        key= {daily._key}
        avatar={{uri:daily.url}}
        title={daily.name}
        subtitle={daily.date}
        onPress={() => navigate('daily', {idDaily: daily._key, idDiary: params.diaryKey})}>
      </ListItem>
    );
  }

  addDaily=()=>{
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    navigate('createDaily', {diaryKey:params.diaryKey});
  }

  searchDaily(text){
    const { params } = this.props.navigation.state;
    if(text != ''){
      let ref = getDatabase().ref("/diary/"+params.diaryKey+"/daily")
      dailyList = (ref.orderByChild("name").startAt(text).endAt(text+'\uf8ff'))
      var that = this
      dailyList.on('value', (snap) => {
        var dailies = [];
          snap.forEach((child) => {
                dailies.push({
                  id: child.key,
                  name: child.val().name,
                  date: child.val().date,
                  experience: child.val().experience,
                  tips: child.val().tips,
                  url: child.val().url,
                });//dalies.push
              that.setState({
                dataSource: this.state.dataSource.cloneWithRows(dailies)
              })//setState
          });//snap.forEach
      })//dailyList.on
    }/*if text has content*/else{
      this.getDailyList(this.dataRef);
    }//else text has no content
  }//search

  render() {
    return(
      <Container>
        <Content>
          <Card>
              <Header style={{backgroundColor: 'white'}} searchBar rounded>
                <Item>
                  <Icon name="search" />
                  <Input placeholder="Search"
                    maxLength = {20}
                    onChangeText={(text) => this.searchDaily(text)}
                  />

                  <Button transparent
                    onPress={this.addDaily.bind(this)}>
                      <Icon active name='add' />
                      <Icon active name='book'/>
                  </Button>
                </Item>

                <Button transparent>
                  <Text>Search</Text>
                </Button>
              </Header>

            <CardItem>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderItem.bind(this)}
                enableEmptySections={true}
                style={styles.listview}>
              </ListView>
            </CardItem>

        </Card>
      </Content>
    </Container>
    );
  }
}

const styles = StyleSheet.create({
  littleComponent:{
    flexDirection: 'row',
    marginBottom: 10,
  },
  addDailyForm:{
    flexDirection: 'column',
  },
  addButton:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  }
});

module.export='ListDaily';
