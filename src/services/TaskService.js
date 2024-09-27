import { db } from './firebase'; 
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'; 

const taskCollectionRef = collection(db, 'tasks');

// Function to add a task
const addTask = async (task) => {
  try {
    const newTask = await addDoc(taskCollectionRef, task);
    console.log('Task added with ID:', newTask.id);
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Function to update a task
const updateTask = async (id, updatedTask) => {
  try {
    const taskDocRef = doc(db, 'tasks', id);
    await updateDoc(taskDocRef, updatedTask);
    console.log('Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Function to get tasks
const getTasks = async () => {
  try {
    const taskSnapshot = await getDocs(taskCollectionRef);
    const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return taskList;
  } catch (error) {
    console.error('Error getting tasks:', error);
  }
};

// Function to delete a task
const deleteTask = async (id) => {
  try {
    const taskDocRef = doc(db, 'tasks', id);
    await deleteDoc(taskDocRef);
    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export { addTask, getTasks, updateTask, deleteTask };
