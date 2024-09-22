import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ProductCartScreen() {
    const [cartProducts, setCartProducts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const loadCartProducts = async () => {
            try {
                const savedProducts = await AsyncStorage.getItem('cartProducts');
                if (savedProducts) {
                    const parsedProducts = JSON.parse(savedProducts);
                    if (Array.isArray(parsedProducts)) {
                        setCartProducts(parsedProducts);
                    } else {
                        console.error("Error: Cart data is not an array");
                    }
                }
            } catch (error) {
                console.error("Error loading cart products:", error);
            }
        };
    
        const unsubscribe = navigation.addListener('focus', loadCartProducts);
        return unsubscribe;
    }, [navigation]);
    

    const deleteProduct = async (index) => {
        try {
            const updatedCartProducts = cartProducts.filter((_, i) => i !== index);
            setCartProducts(updatedCartProducts);
            await AsyncStorage.setItem('cartProducts', JSON.stringify(updatedCartProducts));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const confirmDelete = (index) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteProduct(index) },
            ],
            { cancelable: false }
        );
    };

    const handleGoToCart = () => {
        navigation.navigate('Thank You');
    }

    const handleProductClick = (item) => {
        navigation.navigate('Order Details', { product: item });
    };

    return (
        <View style={styles.container}>
            {cartProducts.length > 0 ? (
                <FlatList
                    data={cartProducts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.productContainer}>
                            <TouchableOpacity style={styles.textContainer} onPress={() => handleProductClick(item)}>
                                <Text style={styles.productText}>{item.product}</Text>
                                <Text style={styles.priceText}>
                                    {item.sale_price ? `Price: $${item.sale_price}` : `Price: $${item.regular_price}`}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(index)}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text>No products in the cart</Text>
            )}
            <TouchableOpacity style={styles.addButton} onPress={handleGoToCart}>
                <Icon name="cart" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Go To Cart</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    textContainer: {
        flex: 1,
    },
    productText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: 10,
        color: 'green',
        marginBottom: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 15
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 10,
        marginLeft: 2
    },
});
