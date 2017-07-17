import { getDatabase } from '../../common/database';
import * as firebase from 'firebase'

class Helper {

/////////////////// Image Url ////////////////////////
  static setImageUrl(userId, url){
    let userNamePath = "/users/"+userId+"/url"
    return getDatabase().ref(userNamePath).set(url)
  }

  static getImageUrl(userId, callback){
      let ref = "/users/"+userId+"/url"
      firebase.database().ref(ref).on('value', (snap) => {
        let url = ''
        if(snap.val()){
          url = snap.val()
        }else{
          url = "https://lh3.googleusercontent.com/-soOfs9zj8Pk/AAAAAAAAAAI/AAAAAAAACjg/Ch8rEE94K2M/s640/photo.jpg"
        }
        callback(url)
      })
  }
/////////////////////////////////////////////////////

///////////////////// Name /////////////////////////
  static getUserName(userId, callback){
      let ref = "/users/"+userId+"/Name"
      firebase.database().ref(ref).on('value', (snap) => {
        let name = ''
        if(snap.val()){
          name = snap.val()
        }
        callback(name)
      })
  }


  static setUserName(userId, name){
    let userNamePath = "/users/"+userId+"/Name"
    return getDatabase().ref(userNamePath).set(name)
  }
/////////////////////////////////////////////////////

///////////////////// LastName /////////////////////
  static getUserLastName(userId, callback){
      let ref = "/users/"+userId+"/LastName"
      firebase.database().ref(ref).on('value', (snap) => {
        let lastName = ''
        if(snap.val()){
          lastName = snap.val()
        }
        callback(lastName)
      })
  }

  static setUserLastName(userId, lastName){
    let userNamePath = "/users/"+userId+"/LastName"
    return getDatabase().ref(userNamePath).set(lastName)
  }
////////////////////////////////////////////////////

/////////////////////// Email /////////////////////
  static getUserEmail(userId, callback){
      let ref = "/users/"+userId+"/Email"
      firebase.database().ref(ref).on('value', (snap) => {
        let email = ''
        if(snap.val()){
          email = snap.val()
        }
        callback(email)
      })
  }

  static setUserEmail(userId, email){
    let userNamePath = "/users/"+userId+"/Email"
    return getDatabase().ref(userNamePath).set(email)
  }
////////////////////////////////////////////////////

/////////////////////// Nickname ///////////////////
static getUserNickname(userId, callback){
    let ref = "/users/"+userId+"/Nickname"
    firebase.database().ref(ref).on('value', (snap) => {
      let nickname = ''
      if(snap.val()){
        nickname = snap.val()
      }
      callback(nickname)
    })
}

static setUserNickname(userId, nickname){
  let userNamePath = "/users/"+userId+"/Nickname"
  return getDatabase().ref(userNamePath).set(nickname)
}
//////////////////////////////////////////////////

/////////////////// DairysByUser //////////////////
  static getDairysByUser(userId, callback){
    let ref = getDatabase().ref("/diary")
    diaryList = (ref.orderByChild("idOwner").equalTo(userId))
    diaryList.on('value', (snap) => {
        var diarys = [];
        snap.forEach((child) => {
            diarys.push({
              id: child.key,
              name: child.val().name,
              description: child.val().description,
              url: child.val().url,
            });
        });
        callback(diarys)
    })
  }
////////////////////////////////////////////////////

}

module.exports = Helper
