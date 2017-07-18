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

//Import de vistas daily
import CreateDaily from './daily/createDaily';
import EditDaily from './daily/editDaily';
import ListDaily from './daily/listDaily';

//Import de vistas Diary
import DairyView from './diary/diary';
import NewDiary from './diary/NewDiary';

export const DTDaily = StackNavigator({
  //Daily
    listDaily: { screen: ListDaily },
    createDaily: { screen: CreateDaily },
    editDaily: { screen: EditDaily },
});

export const DTHome = StackNavigator({
  //Home
    home: { screen: Home },
});

export const DTProfile = StackNavigator({
  //Profile
    profile: { screen: Profile },
});

export const DTNewDiary = StackNavigator({
  //Acceso rapidopara crear diario
    newDiary: { screen: NewDiary }
});

export const DailyTravelTabs = TabNavigator({
    homeTab: { screen: DTHome },
    dailyTab: {screen: DTDaily },
    createDiaryTab: {screen: DTNewDiary },
    profileTab: { screen: DTProfile },
});

export const DailyTravelInitiate = StackNavigator({
    login: { screen: Login },
    signup: {screen: Signup },
    dtTabs: {screen: DailyTravelTabs},

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
