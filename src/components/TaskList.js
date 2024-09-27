import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask, updateTask } from '../services/TaskService'; // Ensure updateTask is imported
import TaskForm from './TaskForm';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minWidth: '600px',
    maxWidth: '800px',
    width: '80%',
  },
}));

const TaskList = () => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Store the task to be edited
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false); // State for delete confirmation dialog
  const [taskToDelete, setTaskToDelete] = useState(null); // Store task to be deleted

  const fetchTasks = async () => {
    const taskList = await getTasks();
    setTasks(taskList);
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when component mounts
  }, []);

  const handleDelete = (task) => {
    setTaskToDelete(task); // Store the task to be deleted
    setIsDeleteConfirmationVisible(true); // Open delete confirmation dialog
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id)); // Remove from state
      setTaskToDelete(null); // Clear the task to be deleted
    }
    setIsDeleteConfirmationVisible(false); // Close the confirmation dialog
  };

  const handleOpenForm = () => {
    setSelectedTask(null); // Reset for new task
    setIsFormVisible(true); // Open the modal
  };

  const handleEditTask = (task) => {
    setSelectedTask(task); // Set the task to be edited
    setIsFormVisible(true); // Open the modal
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Close the modal
    setSelectedTask(null); // Clear the selected task
  };

  const handleCloseDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(false); // Close confirmation dialog
    setTaskToDelete(null); // Clear the task to be deleted
  };

  const handleRefresh = async () => {
    await fetchTasks(); // Fetch tasks again
  };

  return (
    <div className="task-list">
      <h1>Task Management App</h1>
      <div className="toolbar">
        <div className="button-container">
          <Button variant="contained" color="primary" onClick={handleOpenForm}>New Task</Button>
          <Button variant="contained" color="default" style={{ marginLeft: '10px' }} onClick={handleRefresh}>Refresh</Button>
        </div>
        <input type="text" placeholder="Search tasks..." className="search-bar" />
      </div>

      <table>
        <thead>
          <tr>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.assignedTo}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>{task.description}</td>
              <td>
                <Button variant="outlined" onClick={() => handleEditTask(task)}>Edit</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(task)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Task Form Dialog */}
      <Dialog open={isFormVisible} onClose={handleCloseForm} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle>{selectedTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TaskForm selectedTask={selectedTask} setIsFormVisible={setIsFormVisible} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmationVisible} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this task?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskList;
