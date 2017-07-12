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

//Import de vistas daily
import CreateDaily from './daily/createDaily';
import EditDaily from './daily/editDaily';
import ListDaily from './daily/listDaily';

//Import de vistas Diary
import DairyView from './diary/diary';
import NewDiary from './diary/NewDiary';

export const DailyTravelDaily = StackNavigator({
  //Daily
  listDaily: {
    screen: ListDaily,
    navigationOptions: {
      title: "Daily",
    },
  },

    createDaily: { screen: CreateDaily },
    editDaily: { screen: EditDaily },
});

export const DailyTravelHome = StackNavigator({
  //Home
    home: { screen: Home,
      navigationOptions: {
      title: "Home",
      },
    },
});

export const DailyTravelTabs = TabNavigator({
    homeTab: { screen: DailyTravelHome},
    dailyTab: {screen: DailyTravelDaily},
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
