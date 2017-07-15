import {
  AppRegistry,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import {  Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Drawer} from 'native-base';
import strings from '../../common/local_strings.js';
import { getDatabase } from '../../common/database';
import FooterNav from  '../../common/footerNav.js';


const cards = [
  {
    text: 'Card One',
    name: 'One',
    image: require('../../common/img.jpg'),
  },
];

 export default class Home extends Component {
   constructor(props) {
     super(props);
     this.state = {
       image: require('../../common/img.jpg'),
     }
   }
   static navigationOptions = {
    title: "Home",
  };

  render() {
    closeDrawer = () => {
   this.drawer._root.close()
 };
 openDrawer = () => {
   this.drawer._root.open()
 };
    return (
      <Container>
         <Content>
           <Card style={{flex: 0}}>
             <CardItem>
               <Left>
                 <Thumbnail source={this.state.image} />
                 <Body>
                   <Text>NativeBase</Text>
                   <Text note>April 15, 2016</Text>
                 </Body>
               </Left>
             </CardItem>
             <CardItem>
               <Body>
                 <Image source={this.state.image} style={{height: 200, width: 200, flex: 1}}/>
                 <Text>
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eros massa, luctus nec odio sit amet, semper tincidunt mi. Donec euismod lorem vitae porta hendrerit. Fusce imperdiet quam orci, quis tincidunt nisl consectetur in. Suspendisse scelerisque odio at tortor ultrices venenatis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras sagittis blandit volutpat. Maecenas efficitur enim sit amet dui congue auctor.
                 </Text>
               </Body>
             </CardItem>
             <CardItem>
               <Left>
                 <Button transparent textStyle={{color: '#87838B'}}>
                   <Icon name="logo-github" />
                   <Text>1,926 stars</Text>
                 </Button>
               </Left>
             </CardItem>
           </Card>
         </Content>
         
       </Container>
    );
  }
}
