import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, TextInput, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import ProductListScreen from "./ProductListScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { logout } from "../services/AuthService";
import AuthContext from "../context/AuthContext";
import Carousel from "./Carousel";
import TrendyScreen from "./TrendyScreen";

export default function TrendyProductScreen() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        fetch('https://wholesale.techjodo.xyz/api/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data); // Initialize with the full product list
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.grid}>
                {filteredProducts.length ? filteredProducts.map((trendy) => (
                    <View key={trendy.id} style={styles.gridItem}>
                        <TrendyScreen trendyScreen={trendy} />
                    </View>
                )) : (
                    <View style={styles.centered}>
                        <Text>No Products Found....</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    logo: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
        borderRadius: 22,
    },
    searchBox: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        borderRadius: 5
    },
    showCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginRight: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 12,
        marginLeft: 2,
    },
    grid: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 10
    },
    gridItem: {
        marginBottom: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
    errorText: {
        color: 'red',
    },
});
