<template>
    <div>
      <h2>Immediate Milestone</h2>
      <editable-table
        :tableData="immediateMilestones"
        :columns="immediateMilestoneColumns"
        @createRow="createImmediateMilestone"
        @updateRow="updateImmediateMilestone"
        @deleteRow="deleteImmediateMilestone"
        :auth="auth"
      />
  
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
  <script> 
    export default {
      props: {
        auth: {
          type: String,
          required: true
        }
      }
    };
</script>
  <script setup>
 
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import EditableTable from './EditableTable.vue';
  
  const immediateMilestones = ref([]);
  const urgentTasks = ref([]);
  
  const immediateMilestoneColumns = ['ID','Project Name', 'STR', 'Deadline'];
  const urgentTasksColumns = ['ID','Project Name', 'Type', 'Deadline'];
  
  
  const fetchImmediateMilestones = async () => {
    const response = await axios.get('http://localhost:3000/api/immediate-milestones');
    immediateMilestones.value = response.data;
  };
  
  const fetchUrgentTasks = async () => {
    const response = await axios.get('http://localhost:3000/api/urgent-tasks');
    urgentTasks.value = response.data;
  };
  
  const createImmediateMilestone = async (newRow) => {
    const response = await axios.post('http://localhost:3000/api/immediate-milestones', newRow);
    immediateMilestones.value.push(response.data);
  };
  
  const updateImmediateMilestone = async (updatedRow, rowIndex) => {
    const response = await axios.put(`http://localhost:3000/api/immediate-milestones/${updatedRow.id}`, updatedRow);
    immediateMilestones.value.splice(rowIndex, 1, response.data);
  };
  
  const deleteImmediateMilestone = async (rowIndex) => {
    const id = immediateMilestones.value[rowIndex].id;
    await axios.delete(`http://localhost:3000/api/immediate-milestones/${id}`);
    immediateMilestones.value.splice(rowIndex, 1);
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
    fetchImmediateMilestones();
    fetchUrgentTasks();
  });

  // const filteredImmediateMilestoneColumns = immediateMilestoneColumns.filter(col => col !== 'ID');

  </script>
  