/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import  React, {Component} from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import App from './components/views/indexApp';
import Initiate from './components/views/indexInitiate';
import {getAuth} from './components/common/database';


export default class DailyTravel extends Component{
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      run: null,
    }
  }

  componentDidMount() {

    AsyncStorage.getItem("user").then((value) => {
      this.setState({
        user: value
      });
    })
    alert(this.state.user);

    if (this.state.user) {
      this.setState({
        run: <App/>
      });
    } else {
      this.setState({
        run: <Initiate/>
      });
    }
    // getAuth.currentUser.getToken(true).then(function(idToken) {
    //   this.setState({user: idToken});
    //   alert(this.state.user);
    // }).catch(function(error) {
    //   // Handle error
    // });
  }
    render(){
      return(
        this.state.run
      );
    }
  };
AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
