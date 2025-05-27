import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import { fetchUserById, fetchUserByUsername } from '../service/userService'; 
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/profileStyles';

const ProfileScreen = ({ navigation }) => {
  const { username, setUsername } = AsyncStorage.getItem('username');
  const { userId, setUserId } = AsyncStorage.getItem('userId');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;
      try {
        const userData = await fetchUserByUsername(username); 
        setUser(userData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load user profile', [{ text: 'OK', style: 'cancel' }]);
      }
    };
    fetchUser();
  }, [userId]);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('username');
            setUserId(null);
            setUsername(null);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      {user ? (
        <View style={styles.profileCard}>
          <Ionicons name="person-circle-outline" size={80} color="#1a6a6e" style={styles.profileIcon} />
          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading profile...</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};



export default ProfileScreen;