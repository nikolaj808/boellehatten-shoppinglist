/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableHighlight,
  Pressable,
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import Item from './components/Item';
import ItemInput from './components/ItemInput';

GoogleSignin.configure({
  webClientId: '654076028576-96n8n4jvtsfmmqgrludmlvuqlhmnuelk.apps.googleusercontent.com',
});

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('items')
      .onSnapshot(querySnapshot => {
        const items = [];
  
        querySnapshot.forEach(documentSnapshot => {
          items.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
  
        setItems(items);

        setLoading(false);
      });
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Google Sign-In"
          onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
      </View>
    );
  }

  if (loading) {
    return(
      <ActivityIndicator />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.container}>
          <ItemInput style={styles.input} />
          <View style={styles.list}>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <Item item={item} />
              )}
            />
          </View>
        <View style={styles.bottomBar}>
          <Pressable style={{ backgroundColor: 'green', width: '100%' }} onPress={() => console.log('Heya')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 0.1,
  },
  list: {
    flex: 0.8,
    flexGrow: 1,
  },
  bottomBar: {
    flex: 0.1,
    width: '100%',
    backgroundColor: 'lightgray',
    flexDirection: 'row',
  },
});

export default App;
