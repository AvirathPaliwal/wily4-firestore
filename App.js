import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Search from './screens/Search'
import Transaction from './screens/Transaction'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'

export default class App extends Component {
  render() {
    return (
      <AppContaner />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const TabNavigator = createBottomTabNavigator({
  screen1: { screen: Transaction },
  screen2: { screen: Search },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const routeName = navigation.state.routeName;
       // console.log(routeName)
        if (routeName === 'screen1') {
          return (
            <Image source={require("./assets/book.png")}
              style={{ width: 40, height: 40 }}
            />
          )
        }
        else if (routeName === "screen2") {
          return (
            <Image source={require('./assets/searchingbook.png')}
              style={{ width: 40, height: 40 }}
            />
          )
        } // else if closing
      } //tabBarIcon closing
    })
  } // defaultNavigationOptions closing
)
const AppContaner = createAppContainer(TabNavigator);

