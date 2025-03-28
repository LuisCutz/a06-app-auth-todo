import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { List, FAB, Portal, Dialog, Button, Text, IconButton } from 'react-native-paper';
import { useDatabase } from '../../context/DatabaseContext';
import { useSession } from '../../ctx';

export default function TaskList() {
  const router = useRouter();
  const { tasks, deleteTask, fetchTasks } = useDatabase();
  const { signOut } = useSession();
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleDeleteTask = async () => {
    try {
      await deleteTask(selectedTaskId);
      await fetchTasks();
      setDeleteDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const showDeleteDialog = (id) => {
    setSelectedTaskId(id);
    setDeleteDialogVisible(true);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Tasks</Text>
        <IconButton
          icon="logout"
          mode="contained"
          onPress={handleSignOut}
          style={styles.logoutButton}
        />
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
        </View>
      ) : (
        <List.Section style={styles.listSection}>
          {tasks.map((task) => (
            <List.Item
              key={task.id}
              title={task.title}
              right={() => (
                <Button
                  icon="delete"
                  onPress={() => showDeleteDialog(task.id)}
                  textColor="red"
                />
              )}
              style={styles.listItem}
            />
          ))}
        </List.Section>
      )}

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this task?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteTask} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/add-task')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontWeight: 'bold',
  },
  logoutButton: {
    marginLeft: 'auto',
  },
  listSection: {
    flex: 1,
  },
  listItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});