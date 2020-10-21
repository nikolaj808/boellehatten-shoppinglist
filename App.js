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
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

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
      <SafeAreaView>
        <View style={styles.body}>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <View style={{ height: 100, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Item ID: {item.id}</Text>
              <Text>Item Name: {item.name}</Text>
              <Text>Item Quantity: {item.quantity}</Text>
            </View>
          )}
        />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
});

export default App;
