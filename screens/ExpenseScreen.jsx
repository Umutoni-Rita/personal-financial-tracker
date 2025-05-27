// ExpenseScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { getExpenses, getExpenseById, deleteExpense } from '../service/expenseService';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/expenseListStyles';

const ExpenseScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const { userId } = useContext(UserContext);

  const fetchExpenses = async () => {
    if (!userId) {
      setExpenses([]);
      return;
    }
    try {
      const allExpenses = await getExpenses();
      const userExpenses = allExpenses.filter(exp => exp.userId === userId);
      setExpenses(userExpenses);
    } catch (error) {
      Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
    }
  };

  useEffect(() => {
    fetchExpenses(); // Initial fetch
    const unsubscribe = navigation.addListener('focus', () => {
      fetchExpenses(); // Re-fetch when screen is focused
    });
    return unsubscribe; // Cleanup listener on unmount
  }, [userId, navigation]);

  const handleViewDetails = async (expenseId) => {
    try {
      const expense = await getExpenseById(expenseId);
      Alert.alert(
        'Expense Details',
        `Name: ${expense.name}\nAmount: $${Number(expense.amount).toFixed(2)}\nDescription: ${expense.description || 'None'}\nCreated At: ${new Date(expense.createdAt).toLocaleDateString()}`,
        [{ text: 'OK', style: 'cancel' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              Alert.alert('Success', 'Expense deleted successfully', [{ text: 'OK', style: 'cancel' }]);
              fetchExpenses(); // Refresh after deletion
            } catch (error) {
              Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseContent}>
        <Text style={styles.expenseName}>{item.name}</Text>
        <Text style={styles.expenseAmount}>${Number(item.amount).toFixed(2)}</Text>
        <Text style={styles.expenseDescription}>{item.description || 'No description'}</Text>
        <Text style={styles.expenseDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewDetails(item.id)}
          activeOpacity={0.8}
          accessibilityLabel={`View details for ${item.name}`}
        >
          <Ionicons name="eye-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteExpense(item.id)}
          activeOpacity={0.8}
          accessibilityLabel={`Delete ${item.name}`}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Expenses</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add New Expense</Text>
      </TouchableOpacity>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={40} color="#6b7280" />
            <Text style={styles.emptyText}>No expenses found</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Text style={styles.emptyButtonText}>Add an Expense</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default ExpenseScreen;