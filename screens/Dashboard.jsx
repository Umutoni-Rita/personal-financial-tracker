// Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { getExpenses } from '../service/expenseService';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/dashboardStyles';

const Dashboard = ({ navigation }) => {
  const [totalSpending, setTotalSpending] = useState(0);
  const [budget, setBudget] = useState('');
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [biggestPurchase, setBiggestPurchase] = useState(null);
  const { userId } = useContext(UserContext);

  const fetchData = async () => {
    if (!userId) {
      setTotalSpending(0);
      setRecentExpenses([]);
      setBiggestPurchase(null);
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

      // Get recent expenses (last 3)
      const sortedExpenses = userExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentExpenses(sortedExpenses.slice(0, 3));

      // Find biggest purchase
      const biggest = userExpenses.reduce((max, exp) => {
        const amount = Number(exp.amount);
        return amount > Number(max?.amount || 0) ? exp : max;
      }, null);
      setBiggestPurchase(biggest);
    } catch (error) {
      Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData(); // Re-fetch when screen is focused
    });
    return unsubscribe; // Cleanup listener on unmount
  }, [userId, navigation]);

  const handleSaveBudget = async () => {
    if (!budget || isNaN(budget) || Number(budget) <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid positive number', [{ text: 'OK', style: 'cancel' }]);
      return;
    }
    try {
      await AsyncStorage.setItem('budget', budget);
      Alert.alert('Success', 'Budget saved successfully', [{ text: 'OK', style: 'cancel' }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget', [{ text: 'OK', style: 'cancel' }]);
    }
  };

  const renderRecentExpense = ({ item }) => (
    <View style={styles.recentExpenseItem}>
      <Text style={styles.recentExpenseName}>{item.name}</Text>
      <Text style={styles.recentExpenseAmount}>${Number(item.amount).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
      {biggestPurchase && (
        <View style={styles.summaryCard}>
          <Text style={styles.subtitle}>Biggest Purchase</Text>
          <Text style={styles.biggestPurchaseText}>
            {biggestPurchase.name}: ${Number(biggestPurchase.amount).toFixed(2)}
          </Text>
          <Text style={styles.biggestPurchaseDescription}>
            {biggestPurchase.description || 'No description'}
          </Text>
        </View>
      )}
      {recentExpenses.length > 0 && (
        <View style={styles.recentExpensesCard}>
          <Text style={styles.subtitle}>Recent Expenses</Text>
          <FlatList
            data={recentExpenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecentExpense}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

export default Dashboard;