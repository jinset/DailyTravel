import { getDatabase } from '../common/database';

class Helper {

  static setImageUrl(userId, url){
    alert(" SetImageUrl")
    let userNamePath = "/users/"+userId+"/url"
    return getDatabase().ref(userNamePath).set(url)
  }

}

module.export = Helper
