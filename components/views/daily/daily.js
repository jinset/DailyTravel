import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Dimensions,
  ScrollView,
  Image,
  TouchableHighlight,

} from 'react-native';
import { Container, Content, Button, Text, Input, Item, Label, Card, CardItem, View, Body, Form, DeckSwiper } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';
import ViewPager from 'react-native-viewpager';

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
      dataSource: new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      })
    };
  }

  static navigationOptions = ({ navigation }) => ({
      title: strings.daily,
      headerStyle: {backgroundColor: '#70041b', height: 50 },
      headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
    });

    async getPhotos(idDiary, idDaily) {
      return new Promise((resolve, reject) => {
        this.imageDataRef = getDatabase().ref("/diary/"+idDiary+"/daily/"+idDaily+"/photos/");
        this.imageDataRef.on('value', (snap) => {
          var photos=[];
          snap.forEach((child) => {
            console.log("VVVVEEEEAAA" + child.val());
            photos.push({
              _key: child.key,
              url: child.val().url,
            });
          });
          console.log(photos);
          resolve(photos)
        })
      })
    }

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
            experience: snap.val().experience,
            tips: snap.val().tips,
          });
      });

      let photos = await this.getPhotos(idDiary, idDaily);
      console.log("termina");
      console.log(photos);
        this.setState({
          dataSource: this.state.dataSource.cloneWithPages(photos)
        }, ()=>
        console.log(this.state.dataSource)
      );

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

  // _renderItem(item: Object){
  //   console.log(item);
  //   return(
  //     <View key={1}>
  //       <Image source={{uri:data.url}} />
  //     </View>
  //   );
  // }

  render() {
    var that = this.state;
    var tthat = this;
    const { navigate } = this.props.navigation;
    return(
      <Container>
          <Card>

            <CardItem style={{alignItems: 'center'}}>
              <Button transparent small
                onPress={() => this.deleteDaily(this.state.idDaily, this.state.idDiary)}>
                <Icon active name='delete' />
              </Button>

              <Button transparent small
                onPress={()=> navigate('editDaily', {idDaily:this.state.idDaily, idDiary:this.state.idDiary})}>
                <Icon active name='mode-edit' />
              </Button>
            </CardItem>

            <CardItem>
              <Body>
                <Label>{strings.name}</Label>
                <Text style={{fontWeight: 'bold',fontSize: 18, width:260}}>{this.state.name}</Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Label>{strings.date}</Label>
                <Text>{this.state.date}</Text>
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

            {/*<Card>
                <ViewPager
                  dataSource={that.dataSource}
                  renderPage={tthat._renderItem.bind(tthat)}
                />
            </Card>*/}

      </Container>
    );
  }
}


AppRegistry.registerComponent('Daily', () => Daily);

module.export='Daily';
