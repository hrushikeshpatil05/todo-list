import React, { useState, useEffect } from 'react';
import { addTask, updateTask } from '../services/TaskService';

const TaskForm = ({ selectedTask, setIsFormVisible }) => {
  const [formValues, setFormValues] = useState({
    assignedTo: '',
    status: 'Not Started',
    dueDate: '',
    priority: 'Low',
    description: '', // Add description field
  });

  useEffect(() => {
    if (selectedTask) {
      // Populate form with selected task data for editing
      setFormValues({ ...selectedTask });
    } else {
      // Reset form for new task
      setFormValues({
        assignedTo: '',
        status: 'Not Started',
        dueDate: '',
        priority: 'Low',
        description: '', // Reset description for new task
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTask) {
      await updateTask(selectedTask.id, formValues); // Update existing task
    } else {
      await addTask(formValues); // Add new task
    }
    setIsFormVisible(false); // Close the modal after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="assignedTo"
        value={formValues.assignedTo}
        placeholder="Assigned To"
        onChange={handleChange}
        required
      />
      <select name="status" value={formValues.status} onChange={handleChange}>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        type="date"
        name="dueDate"
        value={formValues.dueDate}
        onChange={handleChange}
        required
      />
      <select name="priority" value={formValues.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Normal">Normal</option>
        <option value="High">High</option>
      </select>
      <textarea
        name="description"
        value={formValues.description}
        placeholder="Description"
        onChange={handleChange}
        required
      />
      <button type="submit">{selectedTask ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
