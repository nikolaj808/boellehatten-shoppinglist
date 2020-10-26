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

const Item = ({ item }) => {
    return(
        <View style={styles.container} onTa>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        borderBottomColor: 'slateblue',
        borderBottomStartRadius: 32,
        borderBottomEndRadius: 32,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemName: {
        paddingLeft: 40,
        fontSize: 24,
    },
    itemQuantity: {
        paddingRight: 40,
        fontSize: 24,
    },
});

export default Item;