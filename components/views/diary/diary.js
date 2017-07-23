import { Alert,Image, Dimensions } from 'react-native';
import React, {Component} from 'react';
import { Container, Content,  Toast, Button,Text,Body, Right,List,ListItem,
 Card, CardItem, Thumbnail, Left, Tab, Tabs } from 'native-base';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import DailyList from '../daily/listDaily.js';
import * as firebase from 'firebase';

var idOwner, name, description, culture, url

export default class DiaryView extends Component {
 // headerStyle: {backgroundColor: '#70041b',height: 50 },
   // headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
static navigationOptions = ({ navigation }) => ({
    title: strings.diary,
    headerStyle: {backgroundColor: '#70041b', height: 50 },
    headerTitleStyle : {color:'white',fontWeight: 'ligth',alignSelf: 'center'},
  });
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
                  const { navigate } = this.props.navigation;
                  navigate('profile');
               }
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
                    <Right>
                      <List  style={{flex:  1, flexDirection: 'row'}}>
                        <ListItem avatar>
                          <Thumbnail small source={{ uri: 'https://scontent.fsyq1-1.fna.fbcdn.net/v/t1.0-1/p160x160/16708363_1540542605957763_7227193132559657605_n.jpg?oh=9306caebcffc90ec0aab2042804f1704&oe=59F65BB3' }} />
                        </ListItem>
                      </List>
                    </Right>
                  </CardItem>
                </Card>
                  <Card style={{flex: 0}} >
                <CardItem>
                  <Left>
                    <Text style={{fontWeight: 'bold',fontSize: 18}}>{this.state.name}</Text>
                  </Left>
                  <Right>
                    <Button transparent small
                            onPress={()=> navigate('editDiary', {diaryKey:params.diaryKey})}>
                        <Icon active name='mode-edit' />
                      </Button>
                  </Right>
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
          <Right>
            <Button light full  style= {{backgroundColor: '#D3D0CB'}}
                    onPress={()=> navigate('listDaily', {diaryKey:params.diaryKey})}>
                <Text>{strings.daily}</Text>
              </Button>
          </Right>
        </Content>
      </Container>
    );
  }
}
