// AddExpenseScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createExpense } from '../service/expenseService';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/addExpenseStyles';

const AddExpenseScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useContext(UserContext);

  const handleCreateExpense = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in', [{ text: 'OK', style: 'cancel' }]);
      return;
    }
    if (!name || !amount) {
      Alert.alert('Missing Info', 'Please enter expense name and amount', [{ text: 'OK', style: 'cancel' }]);
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number', [{ text: 'OK', style: 'cancel' }]);
      return;
    }
    setIsLoading(true);
    try {
      const expenseData = { name, amount: Number(amount), description, userId };
      await createExpense(expenseData);
      Alert.alert('Success', 'Expense created successfully', [
        { text: 'OK', onPress: () => {
          setName('');
          setAmount('');
          setDescription('');
          navigation.navigate('Main', { screen: 'Expenses'}); // Explicitly navigate to ExpenseScreen
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color={focusedInput === 'name' ? '#2e8b8f' : '#6b7280'} style={styles.icon} />
        <TextInput
          style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
          placeholder="Expense Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
          accessibilityLabel="Expense name input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color={focusedInput === 'amount' ? '#2e8b8f' : '#6b7280'} style={styles.icon} />
        <TextInput
          style={[styles.input, focusedInput === 'amount' && styles.inputFocused]}
          placeholder="Amount"
          placeholderTextColor="#6b7280"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          onFocus={() => setFocusedInput('amount')}
          onBlur={() => setFocusedInput(null)}
          accessibilityLabel="Expense amount input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="document-text-outline" size={20} color={focusedInput === 'description' ? '#2e8b8f' : '#6b7280'} style={styles.icon} />
        <TextInput
          style={[styles.input, focusedInput === 'description' && styles.inputFocused]}
          placeholder="Description (Optional)"
          placeholderTextColor="#6b7280"
          value={description}
          onChangeText={setDescription}
          onFocus={() => setFocusedInput('description')}
          onBlur={() => setFocusedInput(null)}
          accessibilityLabel="Expense description input"
        />
      </View>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleCreateExpense}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Adding...' : 'Add Expense'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() =>navigation.navigate('Main', { screen: 'Expenses'})}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddExpenseScreen;