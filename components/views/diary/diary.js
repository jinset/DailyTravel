import { Alert,Image, Dimensions } from 'react-native';
import React, {Component} from 'react';
import { Container, Content,  Toast, Button,Text,Body, Right,View,List,ListItem,
 Card, CardItem, Thumbnail, Left, Tab, Tabs } from 'native-base';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import DailyList from '../daily/listDaily.js';
import HelperDiary from './helperDiary';
import * as firebase from 'firebase';

var idOwner, name, description, culture, url

export default class DiaryView extends Component {
  /////////////////////////////////////////NAVIGATE OPTIONS/////////////////////////////////////
static navigationOptions = ({ navigation }) => ({
    title: strings.diary,
    headerStyle: {backgroundColor: 'transparent' },
    });
  ///////////////////////////////////////////CONSTRUCTOR//////////////////////////////////////////
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.state = {
      active: 'false',
      url: '',
      idOwne: '',
      name: '',
      description: '',
        };
  }
  ////////////////////////////////////////////////OBTIENE DATOS DEL DIARIO////////////////////////////////////////////////////////////////
     async componentDidMount(){

           try{
             const { params } = this.props.navigation.state;
               let ref = "/diary/"+ params.diaryKey
               firebase.database().ref(ref).on('value', (snap) => {
                 if(snap.val()){
                    this.setState({
                       url: snap.val().url,
                       idOwner:snap.val().idOwner,
                       name: snap.val().name,
                       description: snap.val().description,

                   })
                  }
                   if(snap.val().culture){
                     this.setState({
                     culture: 'Cultura: '+ snap.val().culture
                      })
                   }
               });
             }catch(error){
                {/* Toast.show({
                     text: strings.error,
                     position: 'bottom',
                     buttonText: 'Okay'
                   })*/}
                  this.props.navigation.goBack()
               }
     }
     deleteDiary(diaryId){
       HelperDiary.deleteDiary(diaryId)
       const { navigate } = this.props.navigation;
      navigate('profile')
     }
  render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
    return (
      <Container>
        <Content>
          <Image source={{uri: this.state.url}}
            style={{height: 100, width: Dimensions.get('window').width}}/>
          <Card >
          <CardItem  style={{padding:10}}>
            <Left>
              <List  style={{flex:  1, flexDirection: 'row'}}>
                <ListItem avatar>
                  <Thumbnail small source={{ uri: 'https://scontent.fsyq1-1.fna.fbcdn.net/v/t1.0-1/p160x160/16708363_1540542605957763_7227193132559657605_n.jpg?oh=9306caebcffc90ec0aab2042804f1704&oe=59F65BB3' }} />
                </ListItem>
              </List>
            </Left>
          </CardItem>
          </Card>
          <Card  >
            <CardItem>
              <Text style={{fontWeight: 'bold',fontSize: 18, width:260}}>{this.state.name}</Text>

              <Button transparent small
                      onPress={() => this.deleteDiary(params.diaryKey)}>
                  <Icon active name='delete' />
                </Button>
              <Button transparent small
                      onPress={()=> navigate('editDiary', {diaryKey:params.diaryKey})}>
                  <Icon active name='mode-edit' />
                </Button>
            </CardItem>
            <CardItem>
              <Body>
                <Text>{this.state.description}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text> {this.state.culture}</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
        <View>
          <Button light full
            onPress={()=> navigate('listDaily', {diaryKey:params.diaryKey})}>
              <Text>{strings.daily}</Text>
          </Button>
        </View>
      </Container>
    );
  }
}
