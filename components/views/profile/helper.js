import { getDatabase } from '../../common/database';
import * as firebase from 'firebase'

class Helper {

/////////////////// Image Url ////////////////////////////
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

  static setImageUrl(userId, url){
    let userNamePath = "/users/"+userId+"/url"
    return getDatabase().ref(userNamePath).set(url)
  }
////////////////////////////////////////////////////////

///////////////////// Name /////////////////////////////
  static getUserName(userId, callback){
      let ref = "/users/"+userId+"/name"
      firebase.database().ref(ref).on('value', (snap) => {
        let name = ''
        if(snap.val()){
          name = snap.val()
        }
        callback(name)
      })
  }

  static setUserName(userId, name){
    let userNamePath = "/users/"+userId+"/name"
    return getDatabase().ref(userNamePath).set(name)
  }
////////////////////////////////////////////////////////

///////////////////// LastName /////////////////////////
  static getUserLastName(userId, callback){
      let ref = "/users/"+userId+"/lastName"
      firebase.database().ref(ref).on('value', (snap) => {
        let lastName = ''
        if(snap.val()){
          lastName = snap.val()
        }
        callback(lastName)
      })
  }

  static setUserLastName(userId, lastName){
    let userNamePath = "/users/"+userId+"/lastName"
    return getDatabase().ref(userNamePath).set(lastName)
  }
//////////////////////////////////////////////////////

/////////////////////// Email ////////////////////////
  static getUserEmail(userId, callback){
      let ref = "/users/"+userId+"/email"
      firebase.database().ref(ref).on('value', (snap) => {
        let email = ''
        if(snap.val()){
          email = snap.val()
        }
        callback(email)
      })
  }

  static setUserEmail(userId, email){
    let userNamePath = "/users/"+userId+"/email"
    return getDatabase().ref(userNamePath).set(email)
  }
////////////////////////////////////////////////////////

/////////////////////// Nickname /////////////////////
static getUserNickname(userId, callback){
    let ref = "/users/"+userId+"/nickname"
    firebase.database().ref(ref).on('value', (snap) => {
      let nickname = ''
      if(snap.val()){
        nickname = snap.val()
      }
      callback(nickname)
    })
}

static setUserNickname(userId, nickname){

  let userNamePath = "/users/"+userId+"/nickname"
  let checkNick = getDatabase().ref('/users').orderByChild("nickname").equalTo(nickname);
  checkNick.once('value', function(snapshot) {
      if (snapshot.exists() == false) {
      return getDatabase().ref(userNamePath).set(nickname)
     }
  })
}
/////////////////////////////////////////////////////

/////////////////////// BirthDay ////////////////////
static getUserBirthDay(userId, callback){
    let ref = "/users/"+userId+"/bornDay"
    firebase.database().ref(ref).on('value', (snap) => {
      let birthday = ''
      if(snap.val()){
        birthday = snap.val()
      }
      callback(birthday)
    })
}

static setUserBirthDay(userId, birthday){
  let userNamePath = "/users/"+userId+"/bornDay"
  return getDatabase().ref(userNamePath).set(birthday)
}
/////////////////////////////////////////////////////

/////////////////// DairysByUser ///////////////////
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
//////////////////////////////////////////////////////

}

module.exports = Helper
