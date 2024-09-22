import React, { useState } from 'react';
import { Text, View, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Platform, Image } from "react-native";
import FormTextField from './FormTextField';
import { register } from '../services/AuthService';

export default function({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        setErrors({});
        setLoading(true);

        if (!name || !email || !phone || !password) {
            setErrors({
                name: !name ? ["Name is Required."] : [],
                email: !email ? ["Email is Required."] : [],
                phone: !phone ? ["Phone Number is Required."] : [],
                password: !password ? ["Password is Required."] : [],
            });
            setLoading(false);
            return;
        }

        try {
            await register({ name, email, phone, password });
            setLoading(false);
            navigation.replace("Login"); // Try using replace if navigate doesn’t work
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
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
                placeholder="Enter Your Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => setName(text)}
                errors={errors?.name}
            />
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
                placeholder="Enter Your Phone Number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                errors={errors?.phone}
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
                <TouchableOpacity style={styles.registerButton} activeOpacity={0.7} onPress={handleRegister}>
                    <Text style={styles.registerButtonText} title="Register">Register</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
                    <Text>Already have an Account?</Text>
                <TouchableOpacity onPress={ () => { navigation.navigate("Login") } } title="Already have an Account">
                    <Text style={styles.loginButton}>Login</Text>
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
        width: 150,
        height: 80,
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
    registerButton: {
        backgroundColor: '#6350A0',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    loginButton: {
        color: 'green',
        marginLeft: 5,
    },
});
