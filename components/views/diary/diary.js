import { Alert,Image, Dimensions,AsyncStorage, Easing } from 'react-native';
import React, {Component} from 'react';
import { Container, Content,  Toast, Button,Text,Body, Right,View,List,ListItem,
 Card, CardItem, Thumbnail, Left, Tab, Tabs } from 'native-base';
import { Icon } from 'react-native-elements';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import DailyList from '../daily/listDaily.js';
import HelperDiary from './helperDiary';
import HideableView from 'react-native-hideable-view';
import * as firebase from 'firebase';
import DialogBox from 'react-native-dialogbox';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import ZoomImage from 'react-native-zoom-image';

var idOwner, name, description, culture, url, key

export default class DiaryView extends Component {
/////////////////////////////////////////NAVIGATE OPTIONS/////////////////////////////////////
static navigationOptions = ({ navigation }) => ({
    title: strings.diary,
    headerStyle: {height: 50 },
    headerTitleStyle : {color:'#808080',fontSize:17},
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
      diaryUsers: [],
      isMe: '',
        };
  }
  ////////////////////////////////////////////////OBTIENE DATOS DEL DIARIO////////////////////////////////////////////////////////////////
     async componentWillMount(){

           try{
             const { params } = this.props.navigation.state;
               let ref = "/diary/"+ params.diaryKey
               key=params.diaryKey;
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
     async componentDidMount(){

       const { params } = this.props.navigation.state;
       //usuarios en diario
          var diarys = [];
          var me=false;
       let   ref = getDatabase().ref("/users")
       userList = (ref.orderByChild("nickname"))
       var that = this
       userList.on('value', (snap) => {
           var users = [];
           AsyncStorage.getItem("user").then((value) => {

                  var diaryUsers = [];
                    snap.forEach((child) => {
                        let checkRepeat = getDatabase().ref('userDiary/').orderByChild("userDiary").equalTo(child.key+'-'+key);
                        checkRepeat.once('value', function(snapshot) {
                            if(snapshot.exists() == true){
                              if(child.key != value){
                                 diaryUsers.push({
                                   id: child.key,
                                   nickname: child.val().nickname,
                                   name: child.val().name,
                                   lastName: child.val().lastName,
                                   url: child.val().url,
                                   invited: child.val().invitationStatus,
                                 });//users.push
                               } //if nick diff from current
                               else{
                               me=true
                                  diaryUsers.push({
                                    id: child.key,
                                    nickname: strings.me,
                                    url: child.val().url,
                                    invited: child.val().invitationStatus,
                                  });//users.push¡
                               }

                            }
                            that.setState({
                                diaryUsers: diaryUsers,
                                isMe: me,
                            })//setState
                        })//checkRepeat.once
                    });//snap.forEach
  })//AsyncStorage
  this.setState({
      isMe: me,
  })
  })//userList.on
      //alert(diaryUsers.length)
    }

      deleteOption( diaryId){
        this.dialogbox.confirm({
          title: strings.confirm,
          content: strings.confirmPopUp,
          ok: {
              text: strings.yes,
              callback: () => {
                  this.deleteDiary(diaryId);
              },
            },
              cancel: {
                text: strings.no,
                callback: () => {
                },
              },
        });
      }

     deleteDiary(diaryId){
       HelperDiary.deleteDiary(diaryId)
       const { navigate } = this.props.navigation;
      navigate('profile')
     }
  render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;

        let listavatars = this.state.diaryUsers.map((u,i) => {
          return (
              <ListItem avatar style={{flex: 1, flexDirection: 'column'}}>
                  <Thumbnail small source={{uri: u.url}}   />
                  <Text note style={{fontSize:10}}>{u.nickname}</Text>
              </ListItem>
                )
          });
    return (
      <Container>
        <Content style={{zIndex: -1, backgroundColor:'white'}}>
          <ZoomImage
            source={{uri: this.state.url}}
            imgStyle={{height: 100, width: Dimensions.get('window').width}}
            showDuration={200}
            enableScaling={false}
            easingFunc={Easing.ease}
          />

            <List  style={{flex:  1, flexDirection: 'row', marginTop:5}}>
               {listavatars}
            </List>
          <Card  >
            <CardItem style={{ flexDirection: 'row'}}>
            <View style={{ flex:  5, alignSelf:'flex-start'}}>
              <Text style={{ fontWeight: 'bold',fontSize: 18}}>{this.state.name} {this.state.isMe} </Text>
              </View>
              <HideableView visible={this.state.isMe} removeWhenHidden={true} duration={100}>
              <View style={{ flex:  1,flexDirection: 'row', alignSelf:'flex-end'}} >
              <Button transparent small style={{marginTop:-2, paddingLeft:2}}
                      onPress={() => this.deleteOption(params.diaryKey)}>
                  <Icon active name='delete' />
                </Button>
              <Button transparent small style={{marginTop:-2, paddingLeft:2}}
                      onPress={()=> navigate('editDiary', {diaryKey:params.diaryKey})}>
                  <Icon active name='mode-edit' />
                </Button>
                </View>
            </HideableView>
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
        <View  style={{zIndex: -1}}>
          <Button light full
            onPress={()=> navigate('listDaily', {diaryKey:params.diaryKey,isMe:this.state.isMe})}>
              <Text>{strings.daily}</Text>
          </Button>
        </View>
        <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
      </Container>
    );
  }
}
