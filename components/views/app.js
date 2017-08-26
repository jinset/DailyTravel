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
import ShowDaily from './diaryMap/showDaily';
import ShowGallery from './diaryMap/showGallery';

//Import Icons
import { Icon } from 'react-native-elements';

export const DTHome = StackNavigator({
  //Home
    home: { screen: Home },
    //Diary
    newDiary: { screen: NewDiary, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
    editDiary: { screen: EditDiary, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
    DairyView: { screen: DairyView , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      //Daily
      listDaily: { screen: ListDaily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      createDaily: { screen: CreateDaily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      editDaily: { screen: EditDaily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      daily: { screen: Daily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      gallery: { screen: Gallery , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
});


export const DTDiaryMap = StackNavigator({
  //Map
    diaryMap: { screen: DiaryMap },
    //DailyMap
    dailyMap: {screen: DailyMap, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
    addDailyMap: {screen: AddDailyMap, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
    //ShowDailies
      showDaily: { screen: ShowDaily },
      showGallery: { screen: ShowGallery },
});
export const DTProfile = StackNavigator({
  //Profile
    profile: { screen: Profile },
  editProfile: {screen: EditProfile, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
        //Diary
      newDiary: { screen: NewDiary , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      editDiary: { screen: EditDiary , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
      DairyView: { screen: DairyView , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
        //Daily
        listDaily: { screen: ListDaily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
        createDaily: { screen: CreateDaily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
        editDaily: { screen: EditDaily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
        daily: { screen: Daily , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
        gallery: { screen: Gallery , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
          //NotificationsView


});

export const DTNotificatios = StackNavigator({
  //Notifications
  notifications: { screen: NotificationsView },
visitProfile: {screen: VisitProfile, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  follows: {screen: Follows, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  followers: {screen: Followers, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  fprofile: { screen: Profile , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  fDairyView: { screen: DairyView , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},

});

export const DTFriends = StackNavigator({
  //Friends
    friends: { screen: Friends },
  visitProfile: {screen: VisitProfile, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  follows: {screen: Follows, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  followers: {screen: Followers, navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  fprofile: { screen: Profile , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
  fDairyView: { screen: DairyView , navigationOptions:{tabBarVisible: false,headerStyle:{ backgroundColor: '#41BEB6',height: 50 },headerTitleStyle : {color:'#FFF',fontSize:17}}},
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
    diaryMapTab: { screen: DTDiaryMap,
      navigationOptions:{
        tabBarIcon: ({ tintColor }) => (
          <Image style={{width:30, height: 30}}
            source={require('../common/icons/map.png')}
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
