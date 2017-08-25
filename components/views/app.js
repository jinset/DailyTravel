import React from 'react';
import { AppRegistry,Image} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import strings from '../common/local_strings';

//Import FooterNav
import FooterNav from '../common/footerNav';

//Import de vistas Login
import Login from './login';
import Signup from './signup';
import GetPassword from './getPassword'

//Import de vistas Home
import Home from './home/home';

//Import de vista Profile
import Profile from './profile/profile';

//Import de vista NotificationsView
import NotificationsView from './notifications/notificationsView.js'

//Import de vista Friends
import Friends from './friends/friends.js'
import VisitProfile from './friends/visitProfile.js'
import Follows from './friends/follows.js'
import Followers from './friends/followers.js'

//Import de vistas daily
import CreateDaily from './daily/createDaily';
import EditDaily from './daily/editDaily';
import ListDaily from './daily/listDaily';
import Daily from './daily/daily';
import Gallery from './daily/gallery';

//Import de vistas Diary
import DairyView from './diary/diary';
import NewDiary from './diary/NewDiary';
import EditDiary from './diary/editDiary';
import EditProfile from './profile/editProfile';
import {getAuth} from '../common/database';

//Import de Mapa
import DiaryMap from './diaryMap/diaryMap.js';
import DailyMap from './diaryMap/dailyMap.js';
import AddDailyMap from './diaryMap/addDailyMap.js';

//Import icons
import { Icon } from 'react-native-elements';

export const DTHome = StackNavigator({
  //Home
    home: { screen: Home },
});


export const DTDiaryMap = StackNavigator({
  //Map
    diaryMap: { screen: DiaryMap },
    //DailyMap
      dailyMap: {screen: DailyMap},
      addDailyMap: {screen: AddDailyMap},

      home: { screen: Home },
});
export const DTProfile = StackNavigator({
  //Profile
    profile: { screen: Profile },
    editProfile: {screen: EditProfile},
        //Diary
        newDiary: { screen: NewDiary },
        editDiary: { screen: EditDiary },
        DairyView: { screen: DairyView },
        //Daily
          listDaily: { screen: ListDaily },
          createDaily: { screen: CreateDaily },
          editDaily: { screen: EditDaily },
          daily: { screen: Daily },
          gallery: { screen: Gallery },
          //NotificationsView


});

export const DTNotificatios = StackNavigator({
  //Notifications
  notifications: { screen: NotificationsView },

});

export const DTFriends = StackNavigator({
  //Friends
    friends: { screen: Friends },
    visitProfile: {screen: VisitProfile},
    follows: {screen: Follows},
    followers: {screen: Followers},
    fprofile: { screen: Profile },
    fDairyView: { screen: DairyView },
});

export const DTNewDiary = StackNavigator({
  //Acceso rapidopara crear diario
    newDiary: { screen: NewDiary },
    editDiary: { screen: EditDiary },
      DairyView: { screen: DairyView },
      //Daily
        listDaily: { screen: ListDaily },
        createDaily: { screen: CreateDaily },
        editDaily: { screen: EditDaily },
});
export const DTNewDaily = StackNavigator({
        listDaily: { screen: ListDaily },
        createDaily: { screen: CreateDaily },
        editDaily: { screen: EditDaily },
});

DTNewDiary.navigationOptions = {
  title : 'profile'
}

export const DailyTravelTabs = TabNavigator({
    homeTab: { screen: DTHome,
      navigationOptions:{
        tabBarIcon: ({ tintColor }) => (
          <Image style={{width: 30, height: 30}}
            source={require('../common/icons/home.png')}
          />
        ),
      }},
      friendsTab: { screen: DTFriends,
        navigationOptions:{

            tabBarIcon: ({ tintColor }) => (
              <Image  style={{width:30, height: 30}}
                source={require('../common/icons/friends.png')}
              />
            ),
        }},
        notificationsTab: { screen: DTNotificatios,
          navigationOptions:{

              tabBarIcon: ({ tintColor }) => (
                <Image  style={{width:30, height: 30}}
                  source={require('../common/icons/notification.png')}
                />
              ),
        }},
    diaryMapTab: { screen: DTDiaryMap,
      navigationOptions:{
        tabBarIcon: ({ tintColor }) => (
          <Image style={{width:30, height: 30}}
            source={require('../common/icons/map.png')}
          />
        ),
    }},
    profileTab: { screen: DTProfile,
      navigationOptions:{

          tabBarIcon: ({ tintColor }) => (
            <Image style={{width:30, height: 30}}
              source={require('../common/icons/profile.png')}
            />
          ),
      }},

    },
  {
    tabBarOptions: {
      showIcon: true,
      showLabel :false,
      style: {
        backgroundColor: '#41BEB6',
      },
      tabStyle: {
        height: 50,
      },
    },
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    showIcon: true,
    showLabel :false,
    lazyLoad: true,
});

export const DailyTravelInitiate = StackNavigator({
    login: { screen: Login },
    signup: {screen: Signup },
    getPassword: {screen: GetPassword },
    dtTabs: {screen: DailyTravelTabs,
      navigationOptions:{
        header: null,
      }},
});


//
//
//
//   //Diary
//     diaryView: { screen: DairyView },
//     newDiary: { screen: NewDiary },
//
//     footerNav: { screen: FooterNav },
// });
