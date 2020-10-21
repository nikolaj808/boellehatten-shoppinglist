import React, { useState } from 'react'
import { TextInput, View, StyleSheet, Button } from 'react-native'

import firestore from '@react-native-firebase/firestore';

const ItemInput = () => {
    const [newItem, setNewItem] = useState('');

    async function addItem() {
        setNewItem('');
        await firestore().collection('items').add({ name: newItem, quantity: 1 });
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={item => setNewItem(item)}
                value={newItem}
                onSubmitEditing={addItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        
    },
    input: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
});

export default ItemInput;