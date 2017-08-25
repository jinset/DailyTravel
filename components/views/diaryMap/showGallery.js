import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Dimensions,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { Container, Content, Button, Text, Input, Item, Label, Card, CardItem, View, Body, Form, DeckSwiper, Right } from 'native-base';
import { getDatabase } from '../../common/database';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import ZoomImage from 'react-native-zoom-image';


export default class ShowGallery extends Component{

  constructor(props){
    super(props);
    const { params } = this.props.navigation.state;
    this.state={
      idDiary: params.idDiary,
      idDaily: params.idDaily,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  static navigationOptions = ({ navigation }) => ({
      title: strings.gallery,
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    });

    async getPhotos() {
      const { params } = this.props.navigation.state;
      let idDiary = params.idDiary;
      let idDaily = params.idDaily;
      this.imageDataRef = getDatabase().ref("/diary/"+this.state.idDiary+"/daily/"+this.state.idDaily+"/photos/");
      this.imageDataRef.on('value', (snap) => {
        var photos=[];
        snap.forEach((child) => {
          photos.push({
            _key: child.key,
            url: child.val().url,
          });
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(photos)
        });
        console.log(photos);
      })
    }

  componentWillMount(){
    this.getPhotos();
  }

  _renderItem(image){
    const { navigate } = this.props.navigation;
    return(
      <Card>
          <ZoomImage
            source={{uri:image.url}}
            imgStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height/2}}
            showDuration={200}
            enableScaling={false}
            easingFunc={Easing.ease}
          />
      </Card>
    );
  }

  render() {
    return(
      <Container>
          <Card>
            <CardItem style={{zIndex: -1}}>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this._renderItem.bind(this)}
                />
            </CardItem>
          </Card>
      </Container>
    );
  }
}


AppRegistry.registerComponent('ShowGallery', () => ShowGallery);

module.export='ShowGallery';
