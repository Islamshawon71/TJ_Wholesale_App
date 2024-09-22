import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function OrderDetailsScreen({ route }) {
    const { product } = route.params || {};

    const baseUrl = 'https://wholesale.techjodo.xyz/public/upload/';
    const productImageUrl = `${baseUrl}${product.product_image}`;

    if (!product) {
        return <Text>No product details available.</Text>; // Handle undefined product
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: productImageUrl }}
                style={styles.productImage}
                accessibilityLabel="Product Image"
            />
            <Text style={styles.productText}>{product.product}</Text>
            {product.variation && (
                <Text style={styles.variationText}>{product.variation}</Text>
            )}
            <Text style={styles.priceText}>
                Price: ${product.sale_price || product.regular_price}
            </Text>
            <Text style={styles.descriptionText}>{product.product_description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 100
    },
    productImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    productText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    variationText: {
        fontSize: 10,
        color: 'green',
        marginBottom: 10,
    },
    priceText: {
        fontSize: 10,
        color: 'green',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 10,
        lineHeight: 22,
        color: '#444',
    },
});
