import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Image,
  Dimensions,
  ScrollView,

} from 'react-native';
import { Container, Content, Button, Text, Input, Item, Label, Card, CardItem, Body, Form } from 'native-base';
import { getDatabase } from '../../common/database';
import DatePicker from 'react-native-datepicker';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';

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
    }
  }

  static navigationOptions = ({ navigation }) => ({
      title: strings.daily,
      headerStyle: {backgroundColor: '#70041b', height: 50 },
      headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
    });

  async componentDidMount(){
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
  }

  deleteDaily(dailyId, diaryId){
    const { goBack } = this.props.navigation;
    getDatabase().ref("/diary/"+diaryId+"/daily/"+dailyId).update({status:false,});
    goBack();
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <Container>
        <Content>
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
        </Content>
      </Container>
    );
  }
}


AppRegistry.registerComponent('Daily', () => Daily);

module.export='Daily';
