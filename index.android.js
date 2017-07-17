/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 import  React, {Component} from 'react';
import { AppRegistry } from 'react-native';
import App from './components/views/index';
import Login from './components/views/login';
//class DailyTravel extends Component{
//   componentDidMount() {
//       let u = await getAuth.currentUser;
//       this.state{
//         user : u,
//       };
//
//       render(){
//       if (user!= null){
//         <App/>
//       }else {
//         <Login/>
//       }
//     }
//   };
// }

AppRegistry.registerComponent('DailyTravel', () => App);
