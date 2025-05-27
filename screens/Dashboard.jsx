import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import * as Notifications from 'expo-notifications'; // Import Expo Notifications
import { getExpenses } from '../service/expenseService';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/dashboardStyles';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Dashboard = ({ navigation }) => {
  const [totalSpending, setTotalSpending] = useState(0);
  const [budget, setBudget] = useState('');
  const [mostExpensive, setMostExpensive] = useState(null);
  const [mostRecent, setMostRecent] = useState(null);
  const [budgetExceeded, setBudgetExceeded] = useState(false); // Track budget exceedance
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const { userId } = useContext(UserContext);

  // Request notification permissions on component mount
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Notifications are required to alert you about budget exceedance.', [{ text: 'OK' }]);
      }
    };
    setupNotifications();
  }, []);

  const fetchData = async () => {
    if (!userId) {
      setTotalSpending(0);
      setMostExpensive(null);
      setMostRecent(null);
      setBudgetExceeded(false);
      setShowModal(false);
      return;
    }
    try {
      // Fetch budget from AsyncStorage
      const storedBudget = await AsyncStorage.getItem('budget');
      if (storedBudget) setBudget(storedBudget);

      // Fetch expenses
      const expenses = await getExpenses();
      const userExpenses = expenses.filter(exp => exp.userId === userId);

      // Calculate total spending
      const total = userExpenses.reduce((sum, exp) => {
        const expenseAmount = Number(exp.amount);
        return isNaN(expenseAmount) ? sum : sum + expenseAmount;
      }, 0);
      setTotalSpending(total);

      const expensive = userExpenses.reduce((max, exp) => {
        const amount = Number(exp.amount);
        return amount > Number(max?.amount || 0) ? exp : max;
      }, null);
      setMostExpensive(expensive);

      const recent = userExpenses.reduce((latest, exp) => {
        return new Date(exp.createdAt) > new Date(latest?.createdAt || 0) ? exp : latest;
      }, null);
      setMostRecent(recent);

      // Check if budget is exceeded
      if (storedBudget && total > Number(storedBudget)) {
        if (!budgetExceeded) { // Only notify once per exceedance
          setBudgetExceeded(true);
          setShowModal(true);
          // Send push notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Budget Exceeded!',
              body: `Your spending ($${total.toFixed(2)}) has exceeded your budget of $${Number(storedBudget).toFixed(2)}. Remember to be financially wise`,
            },
            trigger: null, // Immediate notification
          });
        }
      } else {
        setBudgetExceeded(false);
        setShowModal(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [userId, navigation]);

  const handleSaveBudget = async () => {
    if (!budget || isNaN(budget) || Number(budget) <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid positive number', [{ text: 'OK', style: 'cancel' }]);
      return;
    }
    try {
      await AsyncStorage.setItem('budget', budget);
      Alert.alert('Success', 'Budget saved successfully', [{ text: 'OK', style: 'cancel' }]);
      fetchData(); // Re-check budget after saving
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget', [{ text: 'OK', style: 'cancel' }]);
    }
  };

  const handleAcknowledgeBudgetWarning = () => {
    setShowModal(false); // Close modal but allow continued use
  };

  return (
    <View style={styles.container}>
      {/* Budget Exceedance Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 12,
            width: '80%',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#e63946',
              marginBottom: 10,
            }}>
              Budget Exceeded!
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: 20,
            }}>
              Your spending (${totalSpending.toFixed(2)}) has exceeded your budget of ${Number(budget).toFixed(2)}.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#2e8b8f',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
              onPress={handleAcknowledgeBudgetWarning}
            >
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
              }}>
                I will spend wisely
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Existing Dashboard Content */}
      <Text style={styles.title}>Financial Dashboard</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.subtitle}>Total Spending</Text>
        <Text style={styles.summaryAmount}>${totalSpending.toFixed(2)}</Text>
        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.budgetInput}
            placeholder="Set Monthly Budget"
            placeholderTextColor="#6b7280"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            accessibilityLabel="Monthly budget input"
          />
          <TouchableOpacity style={styles.saveBudgetButton} onPress={handleSaveBudget}>
            <Text style={styles.saveBudgetButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        {budget && (
          <View style={styles.budgetProgress}>
            <Text style={styles.budgetProgressText}>
              {((totalSpending / Number(budget)) * 100).toFixed(0)}% of budget used
            </Text>
          </View>
        )}
      </View>
      {mostExpensive && (
        <View style={styles.summaryCard}>
          <Text style={styles.subtitle}>Most Expensive</Text>
          <Text style={styles.biggestPurchaseText}>
            {mostExpensive.name}: ${Number(mostExpensive.amount).toFixed(2)}
          </Text>
          <Text style={styles.biggestPurchaseDescription}>
            {mostExpensive.description || 'No description'}
          </Text>
        </View>
      )}
      {mostRecent && (
        <View style={styles.summaryCard}>
          <Text style={styles.subtitle}>Most Recent</Text>
          <Text style={styles.biggestPurchaseText}>
            {mostRecent.name}: ${Number(mostRecent.amount).toFixed(2)}
          </Text>
          <Text style={styles.biggestPurchaseDescription}>
            {mostRecent.description || 'No description'} (Date: {new Date(mostRecent.createdAt).toLocaleDateString()})
          </Text>
        </View>
      )}
    </View>
  );
};

export default Dashboard;