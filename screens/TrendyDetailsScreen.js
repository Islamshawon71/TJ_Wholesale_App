import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from './CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function TrendyDetailsScreen({ route }) {
    const { trendyScreen } = route.params;
    const [variations, setVariations] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [quantity, setQuantity] = useState(''); // Local state for quantity input
    const { addToCart } = useCart();
    const navigation = useNavigation();

    const baseUrl = 'https://wholesale.techjodo.xyz/public/upload/';
    const productImageUrl = `${baseUrl}${trendyScreen.product_image}`;

    useEffect(() => {
        fetch('https://wholesale.techjodo.xyz/api/variations')
            .then(response => response.json())
            .then(data => setVariations(data))
            .catch(error => {
                console.error("Error fetching variations:", error);
                Alert.alert("Error", "Failed to load variations.");
            });
    }, []);

    const handleAddToCart = async () => {
        // Ensure quantity is entered
        if (!quantity) {
            Alert.alert('Error', 'Please enter a quantity first.');
            return;
        }
    
        try {
            // Retrieve existing cart items from AsyncStorage
            const existingCart = await AsyncStorage.getItem('cartProducts');
            let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
            // Check if the product with the same variation (or no variation) is already in the cart
            const existingItem = cartItems.find(
                (item) => item.product === trendyScreen.product_name && item.variation === (selectedVariation?.id || 'no-variation')
            );
    
            if (existingItem) {
                Alert.alert('Error', 'You already have this product (or variation) in the cart.');
                return;
            }
    
            // Add the selected product and variation (or default 'no-variation') to the cart
            const cartItem = {
                product: trendyScreen.product_name,
                variation: selectedVariation
                    ? `Qty: ${selectedVariation.start_quantity} - ${selectedVariation.end_quantity}`
                    : 'No variation selected', // Handle no variation case
                sale_price: trendyScreen.sale_price,
                regular_price: trendyScreen.regular_price,
                product_quantity: quantity,
                variation_id: selectedVariation?.id || 'no-variation', // Store variation id if selected
            };
    
            // Add new item to cart and store in AsyncStorage
            cartItems.push(cartItem);
            await AsyncStorage.setItem('cartProducts', JSON.stringify(cartItems));
    
            // Call the addToCart method from your CartContext to update the cart state
            addToCart({ ...trendyScreen, selectedVariation, product_quantity: quantity });
    
            // Navigate to the Product Cart screen
            navigation.navigate('Product Cart');
        } catch (error) {
            console.error("Error saving to AsyncStorage:", error);
            Alert.alert("Error", "Failed to add item to cart.");
        }
    };    

    return (
        <ScrollView style={styles.scrollView}>
            <SafeAreaView style={styles.container}>
                <Image style={styles.productImg} source={{ uri: productImageUrl }} />
                <Text style={styles.title}>{trendyScreen.product_name}</Text>
                <View style={styles.priceContainer}>
                    {width > 600 && (
                        <Text style={[styles.price, styles.strikethrough]}>
                            Regular Price: ${trendyScreen.regular_price}
                        </Text>
                    )}
                </View>
                <Text style={styles.description}>{trendyScreen.product_description}</Text>

                <Text style={styles.price}>Price: ${trendyScreen.sale_price}</Text>

                {/* Variation Buttons */}
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                        {variations.map(variation => (
                            <TouchableOpacity
                                key={variation.id}
                                style={[styles.button, selectedVariation?.id === variation.id && styles.selectedButton]}
                                onPress={() => setSelectedVariation(variation)}
                            >
                                <Text style={styles.buttonText}>
                                    Qty: {variation.start_quantity} - {variation.end_quantity} | ${trendyScreen.sale_price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quantity Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.buttonLabel}>Quantity</Text>
                    <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        placeholder="Type Quantity"
                        value={quantity}
                        onChangeText={(text) => {
                            setQuantity(text);

                            // Parse entered quantity as a number
                            const enteredQuantity = parseInt(text);

                            // Automatically select variation based on entered quantity
                            if (!isNaN(enteredQuantity)) {
                                const matchedVariation = variations.find(
                                    (variation) => 
                                        enteredQuantity >= variation.start_quantity && 
                                        enteredQuantity <= variation.end_quantity
                                );
                                if (matchedVariation) {
                                    setSelectedVariation(matchedVariation);
                                } else {
                                    setSelectedVariation(null); // No matching variation found
                                }
                            }
                        }}
                    />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Icon name="cart-outline" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    productImg: {
        width: '100%',
        height: 350,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    price: {
        fontSize: 12,
        color: 'green',
        marginBottom: 5,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: 'red',
    },
    scrollView: {
        maxHeight: 1200,
    },
    description: {
        fontSize: 10,
        color: '#444',
        marginBottom: 8
    },
    buttonContainer: {
        marginVertical: 10,
    },
    buttonLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Adjusts spacing to fit in a grid style
        marginVertical: 5,
    },
    button: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 8,
        width: '48%', // Ensures two buttons per row
        alignItems: 'center', // Centers text in the button
    },
    selectedButton: {
        backgroundColor: '#4444',
        borderWidth: 1,
        borderColor: '#54545454',
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 10,
        textAlign: 'center', // Centers the text in each button
    },
    inputContainer: {
        marginBottom: 8,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        fontSize: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 10,
        marginLeft: 5,
    },
});
