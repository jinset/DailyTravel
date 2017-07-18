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
      if (this.state.user) {
        this.setState({
          run: <App/>
        });
      } else {
        this.setState({
          run: <Initiate/>
        });
      }
    })
  }
    render(){
      return(
        this.state.run
      );
    }
  };
AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
