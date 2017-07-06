import  React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  ListView,
  Dimensions,
} from 'react-native';
import FooterNav from  '../common/footerNav.js';
import { ListItem } from 'react-native-elements'
import { getDatabase } from '../common/database';
import { Container, Content, Form, Item, Input, Label, Button ,Text,Body,CheckBox ,ActionSheet, Right, Switch, Icon, Card, CardItem, Thumbnail, Left,Image, Footer, FooterTab, Badge  } from 'native-base';

export default class DiaryList extends Component{

  constructor(props) {
    super(props);

    this.dataRef = getDatabase().ref('/diary');

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  getDailyList(dataRef) {
    dataRef.on('value', (snap) => {
      var diaries = [];
      snap.forEach((child) => {
        diaries.push({
          name: child.val().name,
          _key: child.key
          });
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(diaries)
      });
    });
  }

  componentDidMount() {
    this.getDailyList(this.dataRef);
  }

  _renderItem(item) {
    return (
      <ListItem
        key= {item._key}
        title={item.name}
      />
    );
  }
  static navigationOptions = {
    title: 'Diarios',
  };

  render() {
    return(

        <Container>
          <Content>
    <ListView
      dataSource={this.state.dataSource}
      renderRow={this._renderItem.bind(this)}
      enableEmptySections={true}
      style={styles.listview}>
    </ListView>


          </Content>
        <FooterNav></FooterNav>
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

AppRegistry.registerComponent('DiaryList', () => DiaryList);

module.export='DiaryList';