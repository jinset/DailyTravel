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
import DialogBox from 'react-native-dialogbox';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


import ZoomImage from 'react-native-zoom-image';


export default class Gallery extends Component{

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
          console.log("VVVVEEEEAAA" + child.val());
          photos.push({
            _key: child.key,
            url: child.val().url,
          });
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(photos)
        }, ()=>
          console.log(this.state.dataSource)
        );
        console.log(photos);
      })
    }

  componentWillMount(){
    this.getPhotos();
  }

  componentDidMount() {
  MessageBarManager.registerMessageBar(this.refs.alert);
  MessageBarManager.registerMessageBar(this.refs.imageDeleted);
  MessageBarManager.showAlert({
     message: strings.howDeleteImage,
     alertType: 'info',
     position: 'bottom',
     durationToShow: 600,
     durationToHide: 600,
     viewLeftInset: 50,
     viewRightInset: 50,
     animationType: 'SlideFromTop',
     duration: 3500,
     stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey' }
  });
}

  deleteImage(dailyId, diaryId, imageId){
    getDatabase().ref("/diary/"+diaryId+"/daily/"+dailyId+"/photos/"+imageId).remove();
    getDatabase().ref("/diary/"+diaryId+"/daily/"+dailyId+"/photos/").limitToLast(1).on("child_added", function(snapshot) {
      getDatabase().ref().child("/diary/"+diaryId+"/daily/"+dailyId+"/url").set(snapshot.val().url);
    });
    MessageBarManager.showAlert({
       message: strings.imageDeleted,
       alertType: 'info',
       position: 'bottom',
       durationToShow: 600,
       durationToHide: 600,
       viewLeftInset: 50,
       viewRightInset: 50,
       duration: 3500,
       stylesheetInfo: { backgroundColor: 'black', strokeColor: 'grey'}
    });
  }

  deleteOption(dailyId, diaryId, imageId){
    this.dialogbox.confirm({
      title: strings.confirm,
      content: strings.confirmPopUp,
      ok: {
          text: strings.yes,
          callback: () => {
              this.deleteImage(dailyId, diaryId, imageId);
            },
          },
          cancel: {
            text: strings.no,
            callback: () => {

            },
          },
    });
  }

  _renderItem(image){
    const { navigate } = this.props.navigation;
    return(
      <Card>
        <TouchableOpacity
          onLongPress={()=> this.deleteOption(this.state.idDaily, this.state.idDiary, image._key)}>
          <Image
            source={{uri:image.url}}
            style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height/2}}
          />
        </TouchableOpacity>
      </Card>
    );
  }

  render() {
    return(
      <Container>
          <Card>
          <MessageBarAlert ref="imageDeleted" />
          <MessageBarAlert ref="alert" />
            <CardItem style={{zIndex: -1}}>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this._renderItem.bind(this)}
                />
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
            </CardItem>
          </Card>
      </Container>
    );
  }
}


AppRegistry.registerComponent('Gallery', () => Gallery);

module.export='Gallery';
