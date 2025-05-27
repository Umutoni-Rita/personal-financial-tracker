import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { fetchUserByUsername } from '../service/userService';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/loginStyles';
import { Ionicons } from '@expo/vector-icons'; // Install expo/vector-icons for icons

export default function LoginForm({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const { setUserId } = useContext(UserContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password', [
        { text: 'OK', style: 'cancel' }
      ], { cancelable: true });
      return;
    }
    
    try {
      const user = await fetchUserByUsername(username);
      if (!user) {
        Alert.alert('Login Failed', 'User not found', [
          { text: 'OK', style: 'cancel' }
        ], { cancelable: true });
        return;
      }
      if (user.password !== password) {
        Alert.alert('Incorrect Password', 'Please check your password and try again', [
          { text: 'OK', style: 'cancel' }
        ], { cancelable: true });
        return;
      }
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('username', user.username);
      setUserId(user.id);
      navigation.replace('Main')
      Alert.alert('Success', `Welcome, ${user.username}`, [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
      
    } catch (err) {
      Alert.alert('Error', err.message, [
        { text: 'OK', style: 'cancel' }
      ], { cancelable: true });
      
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.mainheading}>Welcome to FinanceWise</Text>
      <Text style={styles.heading}>Log In</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color={focusedInput === 'username' ? '#2e8b8f' : '#6b7280'} style={styles.icon} />
        <TextInput
          style={[styles.input, focusedInput === 'username' && styles.inputFocused]}
          placeholder="Email"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          onFocus={() => setFocusedInput('username')}
          onBlur={() => setFocusedInput(null)}
          accessibilityLabel="Email input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? '#2e8b8f' : '#6b7280'} style={styles.icon} />
        <TextInput
          style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
          placeholder="Password"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
          accessibilityLabel="Password input"
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

