import { TouchableHighlight, Alert ,AsyncStorage,Dimensions,Platform,Image } from 'react-native';
import React, {Component} from 'react';
import { Container, Content, Form,List,Toast,ListItem,Radio,View, Item, Input, Label, Button ,Text,Body , Right, Switch, Card,
   CardItem, Thumbnail, Left  } from 'native-base';
import strings from '../../common/local_strings.js';
import { Icon } from 'react-native-elements';
import AutogrowInput from 'react-native-autogrow-input';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
//Firebase
import { getDatabase } from '../../common/database';
import * as firebase from 'firebase';
//Image Picker
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import HelperDiary from './helperDiary';
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

var key ='';
var usuario ='';
let ref='';

 export default class NewDiary extends Component {
// Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
      title: strings.editDiary,
      headerStyle: {height: 50 },
      headerTitleStyle : {color:'#808080',fontSize:17},
  });
  ////////////////////////////////////////////////////////CONSTRUCTOR/////////////////////////////////////////////////
  constructor(props){
    super(props)
     try{
      const { params } = this.props.navigation.state;
         ref = "/diary/"+ params.diaryKey
         key=params.diaryKey
        firebase.database().ref(ref).on('value', (snap) => {
            this.state = {
              url: snap.val().url,
              idOwner:snap.val().idOwner,
              name: snap.val().name,
              description: snap.val().description,
              privacy: snap.val().privacy,
              culture:  snap.val().culture,
              status:snap.val().status,
              key: '',
              imagePath:'',
              diaryUsers: [],
              users: [],
              uidCurrentUser:'',
            }

        });
      }catch(error){
          Toast.show({
              text: strings.error,
              position: 'bottom',
              buttonText: 'Okay'
            })
           const { navigate } = this.props.navigation;
           navigate('profile');
        }
  }

////////////////////////////////////////////OBTIENE USUARIO LOGGEADO//////////////////////////
   async componentDidMount(){
     var that = this
     //usuarios en diario
        var usersd = [];
     let ref = getDatabase().ref("/userDiary")
    list = (ref.orderByChild("idDiary").equalTo(key))
    list.on('value', (snap) => {
        snap.forEach((child) => {
          if(child.val().status===true){
            usersd.push({
              id: child.key,
            });
          }
        });
        });
        var diarys = [];
           ref = getDatabase().ref("/users")
     userList = (ref.orderByChild("nickname"))
     var that = this
     userList.on('value', (snap) => {
         var users = [];
         var diaryUsers = [];
         AsyncStorage.getItem("user").then((value) => {
           snap.forEach((child) => {
               let checkRepeat = getDatabase().ref('users/'+that.state.idOwner+'/follows/').orderByChild("uid").equalTo(child.key);
               checkRepeat.once('value', function(snapshot) {
                   var f = false
                   if(snapshot.exists() == true){
                    usersd.forEach((user)=>{
                     //If user es owner

                     if(child.key == user.id){
                       diaryUsers.push({
                         id: child.key,
                         nickname: child.val().nickname,
                         name: child.val().name,
                         lastName: child.val().lastName,
                         url: child.val().url,
                         invited: user.invited,
                       });
                     }
                    });
                     if(child.key != value){
                       users.push({
                         id: child.key,
                         nickname: child.val().nickname,
                         name: child.val().name,
                         lastName: child.val().lastName,
                         url: child.val().url,
                         invited: f,
                       });//users.push
                     } //if nick diff from current
                   }

                   that.setState({
                       users: users,
                       diaryUsers: diaryUsers,
                       uidCurrentUser: value,
                   })//setState
               })//checkRepeat.once
           });//snap.forEach
        })//AsyncStorage
   })//userList.on
  }
///////////////////////////////////////////////////////OBTIENE IMAGEN////////////////////////////////////////////////////////////////
   async componentwillMount(){
     try{
       HelperDiary.getImageUrl(key, (url) => {
         this.setState({
           imagePath: url,
         })
       })
       this.setState({
         key: key,
       })
     } catch(error){
       console.log(error)
     }
   }
////////////////////////////////////////////////////ABRE EL IMAGE PICKER////////////////////////////////////////////////////////
   openImagePicker(){
     var options = {
       title: 'Select Avatar',
       storageOptions: {
         skipBackup: true,
         path: 'images/diary'
       }
     }
     ImagePicker.showImagePicker(options, (response) => {
       if(response.didCancel){
         console.log('User cancelled image picker')
       }else if(response.error){
         console.log('Error'+response.error)
       }else if(response.customButton){
         console.log('User tapped custom button'+response.customButton)
       }else{
         this.setState({
           imagePath: response.uri,
         })
          this.createImage()
        }
        })
       }
       ///////////////////////////////////////////////////CREA IMAGEN///////////////////////////////////////////////////////////
       createImage(){
         if(this.state.key){
             try{
                this.state.imagePath ?
                    uploadImage(this.state.imagePath, `${this.state.key}.jpg`)
                        .then((responseData) => {
                          HelperDiary.setImageUrl(this.state.key, responseData)
                        })
                        .done()
                    : null
             } catch(error){
               alert(error)
             }
         }
       }

  ///////////////////////////////////////////////////////CAMBIA PRIVACIDAD////////////////////////////////////////////////////
  privacyChange(){
    this.setState( {privacy: !this.state.privacy})
  }
   ///////////////////////////////////////////////////////AGREGA DIARIO///////////////////////////////////////////////////////
  add(){
     getDatabase().ref().child(ref).set({
      idOwner:this.state.idOwner,
       name:this.state.name,
       description:this.state.description,
       culture: this.state.culture,
       privacy:this.state.privacy,
       url:this.state.url,
       status:this.state.status,
   })
       this.props.navigation.goBack()
}

   addDiaryUsers(userId,userstatus){
     var myRef = getDatabase().ref().push();
          getDatabase().ref().child('userDiary/').push({
          idUser:userId,
          idDiary: this.state.key,
          invitationStus:userstatus,
          status:this.state.status,
      }).catch(function(error) {
          alert(error);
     });
   }
///////////////////////////////////////// addGuest /////////////////////////////////////////////////////////////
    addGuest(i){
      var diaryUsers =[];
      diaryUsers=this.state.diaryUsers;
      diaryUsers.push({
        id:this.state.users[i].id,
        nickname: this.state.users[i].nickname,
        name: this.state.users[i].name,
        lastName: this.state.users[i].lastName,
        url: this.state.users[i].url,
        invited: !this.state.users[i].invited,
      });//users.push

      var users = [];
      users=this.state.users;
      users.splice(i, 1);
      this.setState({
          users: users,
          diaryUsers:diaryUsers,
      })//users.push
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// removeGuest /////////////////////////////////////////////////////////////
    removeGuest(i){
      if(this.state.uidCurrentUser != this.state.diaryUsers[i].id){
        var users =[];
        users=this.state.users;
        users.push({
          id:this.state.diaryUsers[i].id,
          nickname: this.state.diaryUsers[i].nickname,
          name: this.state.diaryUsers[i].name,
          lastName: this.state.diaryUsers[i].lastName,
          url: this.state.diaryUsers[i].url,
          invited: !this.state.diaryUsers[i].invited,
        });//users.push

        var diaryUsers = [];
        diaryUsers=this.state.diaryUsers;
        diaryUsers.splice(i, 1);
        this.setState({
            users: users,
            diaryUsers:diaryUsers,
        })//users.push
    }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////EMPIEZA RENDER///////////////////////////////////////////////////////
  render() {
    const { navigate } = this.props.navigation;

    let listTable = this.state.users.map((u,i) => {
      return (
          <ListItem avatar>
            <Left>
              <Thumbnail small source={{uri: u.url}}   />
            </Left>
            <Body>
              <Text>{u.nickname}</Text>
            </Body>

          <Right>
            <Radio selected={u.invited} onPress={() => this.addGuest(i)} />
          </Right>
          </ListItem>
            )
      });
      let listTable2 = this.state.diaryUsers.map((u,i) => {
        return (
            <ListItem avatar>
              <Left>
                <Thumbnail small source={{uri: u.url}}   />
              </Left>
              <Body>
                <Text>{u.nickname}</Text>
              </Body>

            <Right>
              <Radio selected={u.invited} onPress={() => this.removeGuest(i)} />
            </Right>
            </ListItem>
              )
        });
        let listavatars = this.state.diaryUsers.map((u,i) => {
          return (
              <ListItem avatar>
                  <Thumbnail small source={{uri: u.url}}   />
              </ListItem>
                )
          });
    return (
        <Container>
           <PopupDialog
              ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            >
            <View>
              <List>
              <ListItem itemDivider>
               <Text>{strings.guest}</Text>
             </ListItem>
                  {listTable2}
                  <ListItem itemDivider>
               <Text>{strings.friends}</Text>
             </ListItem>
             {listTable}
              </List>
            </View>
          </PopupDialog>
          <Content  style={{zIndex: -1, backgroundColor:'white'}}>
            <TouchableHighlight onPress={this.openImagePicker.bind(this)}>
            <Thumbnail
              style={{width: 300, height: 100,alignSelf:'center', borderStyle: 'solid', borderWidth: 2,  }}
              source={{uri: this.state.url}} />
            </TouchableHighlight>
            
            <Form style={{padding:10}}>
              <Left>
                <Label>{strings.privacy }</Label>
                <Switch value={ this.state.privacy }
                  onValueChange={this.privacyChange.bind( this ) }/>
              </Left>
                <Right style={{flex:  1, flexDirection: 'row', padding: 10}}>
                  <Button rounded bordered dark onPress={() => {
                    this.popupDialog.show();
                  }}>
                    <Icon name='group-add' />
                  </Button>
                  <List  style={{flex:  1, flexDirection: 'row'}}>
                     {listavatars}
                  </List>
                </Right>


          <Label>{strings.name }</Label>
          <AutogrowInput style={{ fontSize: 18}}  maxLength={30}
           onChangeText={(text) => this.setState({name:text})} value={ this.state.name } />

          <Label>{strings.description }</Label>
          <AutogrowInput style={{ fontSize: 18,minHeight:Dimensions.get('window').height/8}}  maxLength={90}
          onChangeText={(text) => this.setState({description:text})}  value={ this.state.description }
            />

          <Label>{strings.culture }</Label>
          <AutogrowInput style={{ fontSize: 18,minHeight:Dimensions.get('window').height/6}}  maxLength={150}
            onChangeText={(text) => this.setState({culture:text})}  value={ this.state.culture }
          />

          </Form>
        </Content>
                  <Button full dark style= {{backgroundColor: '#41BEB6'}}
                    onPress={() => this.add()} >
                      <Text>{strings.save }</Text>
                  </Button>
      </Container>
    );
  }
}


{/*

                 <Button rounded dark transparent style= {{ margin:10}}>
                    <Icon name='people' />
                  </Button>
  //para los invitados
  //   var myRef = getDatabase().ref().push();
  //      var key =myRef.key;
  //      getDatabase().ref().child('userDiary/').push({
  //      idUser:'4IjaDG6AyTSv2E5KBkChr5DKfMt2',
  //      idDiary: key,
  //      status:this.state.status,
  //  }).catch(function(error) {
  //      alert(error);
  // });

  class ListAvatarExample extends Component {
  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={{ uri: 'data:image/jpeg;base64,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' }} />
              </Left>
              <Body>
                <Text>Kumar Pratik</Text>
              </Body>
            <Right>
              <Radio selected={true} />
            </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
*/}


///////////////////////////////////////////////VARIABLE IMAGEN////////////////////////////////////////////////////////////////////
const uploadImage = (uri, imageName) => {
      const mime='image/jpg'
      return new Promise((resolve, reject) => {
         const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
         let uploadBlob = null
         const imageRef = firebase.storage().ref('images/diary').child(imageName)
         fs.readFile(uploadUri, 'base64')
             .then((data) => {
                return Blob.build(data, {type: `${mime};BASE64`})
             })
             .then((blob) => {
                uploadBlob = blob
                return imageRef.put(blob, {contentType: mime})
             })
             .then(() => {
               uploadBlob.close()
               return imageRef.getDownloadURL()
             })
             .then((url) => {
               resolve(url)
             })
             .catch((error) => {
               reject(error)
             })
      })
   }
