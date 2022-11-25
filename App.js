import { LogBox } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import component
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home';
import AddChats from './components/AddChats';
import ChatScreen from './components/ChatScreen';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle : { backgroundColor: '#2C6BED', },
  headerTitleStyle: { color: 'white', },
  headerTitleAlign: 'center',
  headerTintColor: 'white',

}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name="Add Chats" component={AddChats} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

LogBox.ignoreAllLogs();
