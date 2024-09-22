import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FilterDetailsScreen({ route }) {
    const { productFilter } = route.params;

    const baseUrl = 'https://wholesale.techjodo.xyz/public/upload/';
    const productImageUrl = `${baseUrl}${productFilter.product_image}`;

    return (
        <SafeAreaView style={styles.container}>
            <Image
                accessible
                accessibilityLabel="Product Image"
                style={styles.productImg}
                source={{ uri: productImageUrl }}
            />
            <Text style={styles.title}>{productFilter.product_name}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>Sale Price: ${productFilter.sale_price}</Text>
                <Text style={[styles.price, styles.strikethrough]}>Regular Price: ${productFilter.regular_price}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.description}>{productFilter.product_description}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 100
    },
    productImg: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    title: {
        fontSize: 12, // Increased font size for better readability
        fontWeight: 'bold',
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    price: {
        fontSize: 10, // Increased font size for better readability
        color: 'green',
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: 'red',
    },
    scrollView: {
        flexGrow: 1, // Ensure the ScrollView grows with the content
    },
    description: {
        fontSize: 10, // Increased font size for better readability
        color: '#444',
    },
});
