// ProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import { fetchUserByUsername } from '../service/userService'; 
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/profileStyles';

const ProfileScreen = ({ navigation }) => {
  const { userId, setUserId } = useContext(UserContext); // Use UserContext correctly
  const [username, setUsername] = useState(null); // Local state for username
  const [user, setUser] = useState(null);

  // Fetch username from AsyncStorage on mount
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername);
      } catch (error) {
        Alert.alert('Error', 'Failed to load username', [{ text: 'OK', style: 'cancel' }]);
      }
    };
    loadUsername();
  }, []);

  // Fetch user data when username is available
  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;
      try {
        const userData = await fetchUserByUsername(username);
        if (!userData) {
          throw new Error('User not found');
        }
        setUser(userData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load user profile', [{ text: 'OK', style: 'cancel' }]);
      }
    };
    fetchUser();
  }, [username]); // Depend on username, not userId

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
            try {
              await AsyncStorage.removeItem('userId');
              await AsyncStorage.removeItem('username');
              setUserId(null); // Clear context
              setUsername(null); // Clear local state
              navigation.replace('Login'); // Navigate to Login screen
            } catch (error) {
              Alert.alert('Error', 'Failed to log out', [{ text: 'OK', style: 'cancel' }]);
            }
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
          <Text style={styles.profileEmail}>{user.email || 'No email provided'}</Text>
          
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