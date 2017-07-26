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
import { Container, Content, Button, Text, Input,Right } from 'native-base';
import { ListItem } from 'react-native-elements';
import { getDatabase } from '../../common/database';
import strings from '../../common/local_strings.js';

export default class ListDaily extends Component{

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    let idDiary = params.diaryKey;
    this.dataRef = getDatabase().ref("/diary/"+idDiary+"/daily/");
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  static navigationOptions = {
    title: strings.daily,
    headerStyle: {backgroundColor: '#70041b',height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
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
          tips: child.val().tips
          });
      });
      console.log(dailies);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dailies)
      });
    });
  }

  componentDidMount() {
    this.getDailyList(this.dataRef);
  }

  _renderItem(item) {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <ListItem
        key= {item._key}
        title={item.date + "          " + item.name}
        onPress={() => navigate('editDaily', {daily: item, idDiary: params.diaryKey})}
      />
    );
  }
  addDaily=()=>{
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    navigate('createDaily', {diaryKey:params.diaryKey});
  }

  render() {
    return(
      <Container>
        <Button transparent large
          onPress={this.addDaily.bind(this)}>
            <Icon active name='add' />
        </Button>

        <Content>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}>
          </ListView>
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
