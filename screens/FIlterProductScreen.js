import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import FilterScreen from './FilterScreen';

const FilterProductScreen = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);  // Add loading state
    const [error, setError] = useState(null);      // Add error state

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

    const handleSearch = (text) => {
        const filtered = products.filter(product =>
            product.product_name?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search Products...."
                onChangeText={handleSearch}
            />

            <View style={styles.list}>
                {filteredProducts.length ? (
                    filteredProducts.map((product) => (
                        <View key={product.id} style={styles.listItem}>
                            <FilterScreen productFilter={product} />
                        </View>
                    ))
                ) : (
                    <View style={styles.centered}>
                        <Text>No Products Found....</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

// Styles
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 5
    },
    list: {
        flexDirection: 'column',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default FilterProductScreen;
