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
import { Container, Content, Button, Text, Input, Item, Label,Left,Right, Card, CardItem, View, Body, Form, DeckSwiper } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';
import DialogBox from 'react-native-dialogbox';
import ZoomImage from 'react-native-zoom-image';

export default class Daily extends Component{

  constructor(props){
    super(props);
    this.state={
      idDiary: null,
      idDaily: null,
      name: null,
      date: null,
      experience: null,
      tips: null,
      place: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  static navigationOptions = ({ navigation }) => ({
      title: strings.daily,
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#9A9DA4',fontSize:17},
    });

  async getDaily(){
    try {
      const { params } = this.props.navigation.state;

      let idDiary = params.idDiary;
      let idDaily = params.idDaily;
      this.dataRef = getDatabase().ref("/diary/"+idDiary+"/daily/"+idDaily);
      this.dataRef.on('value', (snap) => {
          this.setState({
            idDiary: params.idDiary,
            idDaily: snap.key,
            name: snap.val().name,
            date: snap.val().date,
            place: snap.val().place,
            experience: snap.val().experience,
            tips: snap.val().tips,
          });
      });

      this.imageDataRef = getDatabase().ref("/diary/"+idDiary+"/daily/"+idDaily+"/photos/");
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
      })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  componentDidMount(){
    this.getDaily();
  }

  deleteDaily(dailyId, diaryId){
    const { goBack } = this.props.navigation;
    getDatabase().ref("/diary/"+diaryId+"/daily/"+dailyId).update({status:false,});
    goBack();
  }

  deleteDailyOption(dailyId, diaryId){
    this.dialogbox.confirm({
      title: strings.confirm,
      content: strings.confirmPopUp,
      ok: {
          text: strings.yes,
          callback: () => {
              this.deleteDaily(dailyId, diaryId);
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
          <ZoomImage
            source={{uri:image.url}}
            imgStyle={{width: Dimensions.get('window').width/6, height: Dimensions.get('window').height/10}}
            showDuration={200}
            enableScaling={false}
            easingFunc={Easing.ease}
          />
      </Card>
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <Container >

      <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
      <Content style={{zIndex: -1, backgroundColor:'white'}}>
          <Card>
            <CardItem>
              <Left>
                <Label>{this.state.date}</Label>
              </Left>

              <Body>
              </Body>

              <Right style={{flexDirection: 'row'}}>
                <Button transparent small style={{paddingLeft: 10, paddingRight: 10}}
                  onPress={() => this.deleteDailyOption(this.state.idDaily, this.state.idDiary)}>
                  <Icon active name='delete' />
                </Button>

                <Button transparent small style={{paddingLeft: 10, paddingRight: 10}}
                  onPress={()=> navigate('editDaily', {idDaily:this.state.idDaily, idDiary:this.state.idDiary})}>
                  <Icon active name='mode-edit' />
                </Button>
              </Right>
            </CardItem>

            <CardItem>
              <Body>
                <Text note style={{fontWeight: 'bold',fontSize: 18, width:260}}>{this.state.name}</Text>
              </Body>
            </CardItem>

            <CardItem>
              <ScrollView horizontal={true}>
                <Button transparent small style={{paddingLeft: 10, paddingRight: 20, marginTop:10}}
                  onPress={() => navigate('gallery', {idDaily:this.state.idDaily, idDiary:this.state.idDiary})}>
                  <Icon active name='visibility' />
                </Button>
                <ListView
                  horizontal={true}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderItem.bind(this)}
                />
              </ScrollView>
            </CardItem>

            <CardItem>
              <Body>
                <Label>{strings.place}</Label>
                <Text>{this.state.place}</Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Label>{strings.experiences}</Label>
                <Text>{this.state.experience}</Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Label>{strings.tips}</Label>
                <Text>{this.state.tips}</Text>
              </Body>
            </CardItem>

          </Card>
          </Content>

      </Container>
    );
  }
}


AppRegistry.registerComponent('Daily', () => Daily);

module.export='Daily';
