<template>
    <div>
      <h2>Urgent Tasks</h2>
      <editable-table
        :tableData="urgentTasks"
        :columns="urgentTasksColumns"
        @createRow="createUrgentTask"
        @updateRow="updateUrgentTask"
        @deleteRow="deleteUrgentTask"
        :auth="auth"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import EditableTable from './EditableTable.vue';
  
  const urgentTasks = ref([]);
  const urgentTasksColumns = ['Project Name', 'Type', 'Deadline'];
  
  const fetchUrgentTasks = async () => {
    const response = await axios.get('http://localhost:3000/api/urgent-tasks');
    urgentTasks.value = response.data;
  };
  
  const createUrgentTask = async (newRow) => {
    const response = await axios.post('http://localhost:3000/api/urgent-tasks', newRow);
    urgentTasks.value.push(response.data);
  };
  
  const updateUrgentTask = async (updatedRow, rowIndex) => {
    const response = await axios.put(`http://localhost:3000/api/urgent-tasks/${updatedRow.id}`, updatedRow);
    urgentTasks.value.splice(rowIndex, 1, response.data);
  };
  
  const deleteUrgentTask = async (rowIndex) => {
    const id = urgentTasks.value[rowIndex].id;
    await axios.delete(`http://localhost:3000/api/urgent-tasks/${id}`);
    urgentTasks.value.splice(rowIndex, 1);
  };
  
  onMounted(() => {
    fetchUrgentTasks();
  });
  </script>

  