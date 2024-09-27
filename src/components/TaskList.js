import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../services/TaskService';
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
  const [tasks, setTasks] = useState([]);  // State to store all tasks
  const [filteredTasks, setFilteredTasks] = useState([]);  // State to store filtered tasks
  const [selectedTask, setSelectedTask] = useState(null); // Store the task to be edited
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  // State for search query
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks and set them in both `tasks` and `filteredTasks` state
  useEffect(() => {
    const fetchTasks = async () => {
      const taskList = await getTasks();
      setTasks(taskList);
      setFilteredTasks(taskList);  // Initially, filtered tasks = all tasks
    };

    fetchTasks();
  }, []);

  // Handle the search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();  // Convert search query to lowercase for case-insensitive search
    setSearchQuery(query);

    // Filter tasks based on the search query
    const filtered = tasks.filter(task => 
      task.assignedTo.toLowerCase().includes(query) ||  // Check if `assignedTo` contains the query
      task.description.toLowerCase().includes(query) || // Check if `description` contains the query
      task.status.toLowerCase().includes(query) ||      // Check if `status` contains the query
      task.priority.toLowerCase().includes(query)       // Check if `priority` contains the query
    );

    setFilteredTasks(filtered);  // Update the filtered tasks
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setFilteredTasks(filteredTasks.filter(task => task.id !== taskToDelete.id));  // Update filtered tasks after delete
      setTaskToDelete(null);
    }
    setIsDeleteConfirmationVisible(false);
  };

  const handleOpenForm = () => {
    setSelectedTask(null);
    setIsFormVisible(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedTask(null);
  };

  const handleCloseDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(false);
    setTaskToDelete(null);
  };

  return (
    <div className="task-list">
      <h1>Task Management App</h1>
      <div className="toolbar">
        <div className="button-container">
          <Button variant="contained" color="primary" onClick={handleOpenForm}>New Task</Button>
          <Button variant="contained" color="default" style={{ marginLeft: '10px' }}>Refresh</Button>
        </div>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery}  // Bind search input to state
          onChange={handleSearch}  // Update search query on input change
          className="search-bar" 
        />
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
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td>{task.assignedTo}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>{task.description}</td>
              <td>
                <Button variant="outlined" onClick={() => handleEditTask(task)}>Edit</Button>
                <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }} onClick={() => handleDelete(task)}>Delete</Button>
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
