import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

//Import FooterNav
import FooterNav from '../common/footerNav';

//Import de vistas Login
import Login from './login';
import Signup from './signup';

//Import de vistas Home
import Home from './home/home';

//Import de vista Profile
import Profile from './profile/profile';

//Import de vista Friends
import Friends from './friends/friends.js'

//Import de vistas daily
import CreateDaily from './daily/createDaily';
import EditDaily from './daily/editDaily';
import ListDaily from './daily/listDaily';

//Import de vistas Diary
import DairyView from './diary/diary';
import NewDiary from './diary/NewDiary';
import EditDiary from './diary/editDiary';
import EditProfile from './profile/editProfile';
import {getAuth} from '../common/database';


export const DTHome = StackNavigator({
  //Home
    home: { screen: Home },
});

export const DTProfile = StackNavigator({
  //Profile
    profile: { screen: Profile },
    editProfile: {screen: EditProfile},

});

export const DTFriends = StackNavigator({
  //Friends
    friends: { screen: Friends },
});

export const DTNewDiary = StackNavigator({
  //Acceso rapidopara crear diario
    newDiary: { screen: NewDiary },
      profile: { screen: Profile },
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
          tabBarLabel: 'Home',
        }},
        createDiaryTab: {screen: DTNewDiary,
          navigationOptions:{
            tabBarLabel: 'Diary',
          }},
        friendsTab: { screen: DTFriends,
            navigationOptions:{
              tabBarLabel: 'Friends',
          }},
        profileTab: { screen: DTProfile,
          navigationOptions:{
            tabBarLabel: 'Profile',
          }},

    },
  {
    tabBarOptions: {
      style: {
       backgroundColor: '#70041b',
      },
      tabStyle: {
        height: 50,
      },
    },
    tabBarPosition: 'bottom',
    showIcon: true,
    lazyLoad: true,
});

export const DailyTravelInitiate = StackNavigator({
    login: { screen: Login },
    signup: {screen: Signup },
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
