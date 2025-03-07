import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDatabase } from '../../context/DatabaseContext';

export default function AddTask() {
  const router = useRouter();
  const { addTask } = useDatabase();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask(title.trim());
      router.back();
    } catch (error) {
      setError('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Task Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setError('');
        }}
        style={styles.input}
        mode="outlined"
        error={!!error}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Add Task
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});