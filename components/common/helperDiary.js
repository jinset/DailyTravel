import { getDatabase } from '../common/database';
import * as firebase from 'firebase'

class HelperDiary {

  static setImageUrl(diaryId, url){
    let diaryNamePath = "/diary/"+diaryId+"/url"
    return getDatabase().ref(diaryNamePath).set(url)
  }

  static getImageUrl(diaryId, callback){
      let ref = "/diary/"+diaryId+"/url"
      firebase.database().ref(ref).on('value', (snap) => {
        let url = ''
        if(snap.val()){
          url = snap.val()
        }else{
          url = "http://corpuschristi.neighborhoodscope.com/wp-content/themes/zinox-media/assets/img/noimagedefault.jpg"
        }
        callback(url)
      })
  }

}

module.exports = HelperDiary
