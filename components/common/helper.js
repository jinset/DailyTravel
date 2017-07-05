import * as firebase from 'firebase'

class Helper {

  static setImageUrl(url){
    let userNamePath = "/dairy/daily/photo/url"
    return firebase.database().ref(userNamePath).set(url)
  }

}

module.export = Helper
