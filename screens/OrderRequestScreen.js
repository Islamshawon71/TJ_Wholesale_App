import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import OrderScreen from "./OrderScreen";
import { getToken } from "../services/TokenService";

export default function OrderRequestScreen() {
    const [placeOrder, setPlaceOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                console.log('Token:', token); // Log the token to see if it's valid
                const response = await fetch('https://wholesale.techjodo.xyz/api/order_requests', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                // console.log(response)
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }
                const data = await response.json();
                setPlaceOrder(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, []);    

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <View>
            {placeOrder.length > 0 ? (
                placeOrder.map((order) => <OrderScreen key={order.id} order={order} />)
            ) : (
                <Text>No orders found.</Text>
            )}
        </View>
    );
}