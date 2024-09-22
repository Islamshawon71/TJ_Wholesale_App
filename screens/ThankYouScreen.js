import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const ThankYouScreen = ({ navigation }) => {
    const handleHomePress = () => {
        // Debugging: Check if the navigation object is available
        // console.log('Navigating to Home screen');
        
        // Optional: Use an alert to confirm button press
        // Alert.alert('Navigation', 'Navigating to Home screen');
        
        // Navigate to the Home screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'Product' }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.thankYouText}>Thank You for Your Order!</Text>
            <Text style={styles.description}>
                Your order has been placed successfully. We will notify you when it's ready for shipping.
            </Text>
            <Button
                title="Home"
                onPress={handleHomePress} // Use the handleHomePress function
                color="#007bff" // Optional: Customize the button color
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    thankYouText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default ThankYouScreen;
