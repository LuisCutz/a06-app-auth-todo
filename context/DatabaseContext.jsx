import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [db, setDb] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const initDB = async () => {
      try {
        // For expo-sqlite v15+, we need to create a database connection
        const database = SQLite.openDatabaseSync('tasks.db');
        // Alternative approach for newer versions:
        // const database = new SQLite.SQLiteDatabase('tasks.db');
        setDb(database);
        console.log('Database opened successfully');
      } catch (error) {
        console.error('Error opening database:', error);
      }
    };
    initDB();
  }, []);
  
  useEffect(() => {
    if (db) {
      const createTable = async () => {
        try {
          // Try this approach instead
          await db.execAsync(
            'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);'
          );
          console.log('Table created successfully');
        } catch (error) {
          console.error('Error creating table:', error);
        }
      };
      createTable();
    }
  }, [db]);
  
  const fetchTasks = async () => {
    if (!db) return;
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM tasks ORDER BY created_at DESC;'
      );
      setTasks(result || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };
  
  const addTask = async (title) => {
    if (!db) return;
    try {
      const result = await db.runAsync(
        'INSERT INTO tasks (title, created_at) VALUES (?, datetime("now"))',
        [title]
      );
      console.log('Task added successfully');
      fetchTasks(); // Actualizar lista al agregar tarea
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };
  
  const deleteTask = async (id) => {
    if (!db) return;
    try {
      await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
      console.log('Task deleted, ID:', id);
      fetchTasks(); // Actualizar lista al eliminar tarea
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
  
  return (
    <DatabaseContext.Provider value={{ tasks, fetchTasks, addTask, deleteTask }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}