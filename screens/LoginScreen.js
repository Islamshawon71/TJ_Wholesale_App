import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image, Platform } from "react-native"; // Added ActivityIndicator import
import { loadUser, login } from '../services/AuthService';
import AuthContext from '../context/AuthContext';
import FormTextField from './FormTextField';

export default function({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);

    async function handleLogin() {
        setErrors({});
        setLoading(true);
    
        if (!email || !password) {
            setErrors({
                email: !email ? ["Email is Required."] : [],
                password: !password ? ["Password is Required."] : [],
            });
            setLoading(false);
            return;
        }
    
        try {
            await login({ email, password });
            setLoading(false);
            const user = await loadUser();
            setUser(user);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error.response) {
                console.error(`API error (status: ${error.response.status}):`, error.response.data);
            } else if (error.request) {
                console.error("No response from the server:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <View style={styles.column}>
            <View style={styles.formContainer}>
                <View style={styles.logoContainer}>
                    <Image
                    source={{ uri: 'https://techjodo.com/techjodo-logo.png' }}
                    style={styles.logo}
                    alt="logo"
                    />
                </View>
            <FormTextField
                style={styles.input}
                placeholder="Enter Your Email"
                placeholderTextColor="#999"
                keyboardType="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                errors={errors?.email}
            />
            <FormTextField
                style={styles.input}
                placeholder="Enter Your Password"
                placeholderTextColor="#999"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                errors={errors?.password}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={handleLogin}>
                <Text style={styles.loginButtonText} title="Login">Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => { navigation.navigate("Forgot Password") } } title="Forgot Password">
                <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={ () => { navigation.navigate("Register") } } title="Create an Account">
                <Text style={styles.registerButton}>Register</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    column: {
        flex: 1,
        // justifyContent: 'center',
        // marginHorizontal: 10,
    },
    formContainer: {
        // paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 180,
        height: 120,
        resizeMode: 'contain',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        marginVertical: 8,
        borderRadius: 5,
        color: '#333',
    },
    buttonContainer: {
        marginVertical: 10,
    },
    loginButton: {
        backgroundColor: '#6350A0',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    registerButton: {
        color: 'green',
        marginLeft: 5,
    },
});