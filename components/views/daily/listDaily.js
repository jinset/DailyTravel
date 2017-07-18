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

export default class ListDaily extends Component{

  constructor(props) {
    super(props);

    this.dataRef = getDatabase().ref('/daily');

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  static navigationOptions = {
    header: null,
    title: 'Daily'
 };

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
    return (
      <ListItem
        key= {item._key}
        title={item.date + "          " + item.name}
        onPress={() => navigate('editDaily')}
      />
    );
  }
  addDaily=()=>{
    const { navigate } = this.props.navigation;
    navigate('createDaily');
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
