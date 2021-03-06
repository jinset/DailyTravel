import { getDatabase } from '../../common/database';
import * as firebase from 'firebase'

class HelperDiary {

  static setImageUrl(diaryId, uri){
    let diaryNamePath = "/diary/"+diaryId
    alert(diaryNamePath)
    return getDatabase().ref(diaryNamePath).update({url:uri,});
  }

  static getImageUrl(diaryId, callback){
      let ref = "/diary/"+diaryId+"/url"
      firebase.database().ref(ref).on('value', (snap) => {
        let url = ''
        if(snap.val()){
          url = snap.val()
        }else{
          url = "https://firebasestorage.googleapis.com/v0/b/daily-travel-6ff5f.appspot.com/o/images%2Fdiary%2FdefultDiary.png?alt=media&token=238cc03e-2a95-426a-8d32-7adf0e52bd6f"
        }
        callback(url)
      })
  }

  static deleteDiary(diaryId){
    let diaryNamePath = "/diary/"+diaryId
    return getDatabase().ref(diaryNamePath).update({status:'false',});
  }
  static getOwner(diaryId,userId, callback){
      let ref = "/diary/"+diaryId+"/url"
      firebase.database().ref(ref).on('value', (snap) => {
        let url = ''
        if(snap.val()){
          url = snap.val()
        }else{
          url = "https://firebasestorage.googleapis.com/v0/b/daily-travel-6ff5f.appspot.com/o/images%2Fdiary%2FdefultDiary.png?alt=media&token=238cc03e-2a95-426a-8d32-7adf0e52bd6f"
        }
        callback(url)
      })
  }

  static getGuest(diaryId,userId, callback){
      let ref = "/diary/"+diaryId+"/url"
      firebase.database().ref(ref).on('value', (snap) => {
        let url = ''
        if(snap.val()){
          url = snap.val()
        }else{
          url = "https://firebasestorage.googleapis.com/v0/b/daily-travel-6ff5f.appspot.com/o/images%2Fdiary%2FdefultDiary.png?alt=media&token=238cc03e-2a95-426a-8d32-7adf0e52bd6f"
        }
        callback(url)
      })
  }
}

module.exports = HelperDiary
