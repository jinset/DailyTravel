import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  ListView,
  Image,
  Dimensions,
  Button,
} from 'react-native';


export default class EditDaily extends Component{

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      name: null,
      experience: null,
      tips: null,
      dataSource: ds.cloneWithRows([null]),
    };
  }

  onPressAddDaily(){
    // alert(this.state.name);
    // firebaseApp.database().ref().child('daily/').update({
    //   name: this.state.name,
    //   experience: this.state.experience,
    //   tips: this.state.tips,
    // });
  }

  render() {
    return(
      <View style={styles.addDailyForm}>
        <View style={styles.littleComponent}>
          <Text>Daily name:</Text>
          <TextInput style={{width:250}}
            onChangeText={(text) => this.setState({name:text})}
          />
        </View>

        <View style={styles.littleComponent}>
          <Text>My experience:</Text>
          <TextInput style={{width:250}}
            onChangeText={(text) => this.setState({experience:text})}
          />
        </View>

        <View style={styles.littleComponent}>
          <Text>Tips:</Text>
          <TextInput style={{width:250}}
            onChangeText={(text) => this.setState({tips:text})}
          />
        </View>

        <View>
          <Button  full light style= {{backgroundColor: '#D3D0CB'}}
            onPress={this.onPressAddDaily.bind(this)}
            title="Add daily"
            color="#841584"
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  littleComponent:{
    flexDirection: 'row',
    marginBottom: 10,
  },
  addDailyForm:{
    flexDirection: 'column',
  },
  addButton:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  }
});

AppRegistry.registerComponent('EditDaily', () => EditDaily);

module.export='EditDaily';
