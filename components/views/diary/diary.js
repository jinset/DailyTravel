import { Alert,Image, Dimensions } from 'react-native';
import React, {Component} from 'react';
import { Container, Content,  Toast, Button,Text,Body, Right,
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
    header:null,
  });
  constructor(props) {
    super(props);
    this.state = {
      active: 'false',
    };

    try{
      const { params } = this.props.navigation.state;
        let ref = "/diary/"+ params.diaryKey
        firebase.database().ref(ref).on('value', (snap) => {
          if(snap.val()){
              url= snap.val().url,
              idOwner=snap.val().idOwner,
              name= snap.val().name,
              description= snap.val().description

           }
           if(snap.val().culture){
              culture= strings.culture +": "+ snap.val().culture
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
         <Tabs initialPage={1} >
          <Tab heading={strings.diary}  tabStyle={style={backgroundColor: '#70041b', color:'white'}} activeTabStyle={style={backgroundColor: '#70041b', color:'white'}}>
        <Content>
          <Card style={{flex: 0}} >
                <Image source={{uri: url}}
                style={{height: 100, width: Dimensions.get('window').width}}/>
                <CardItem>
                  <Left>
                    <Text style={{fontWeight: 'bold',fontSize: 18}}>{name}</Text>
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
                    <Text>{description}</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>{culture}</Text>
                  </Body>
                </CardItem>
          </Card>
        </Content>
        </Tab>
          <Tab heading={strings.daily}  tabStyle={style={backgroundColor: '#70041b', color:'white'}} activeTabStyle={style={backgroundColor: '#70041b', color:'white'}}>
        <DailyList/>
          </Tab>
           </Tabs>
      </Container>
    );
  }
}
