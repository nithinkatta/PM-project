<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <!-- <div style="width: 80%;"> -->

            <th style="width: 200px;" v-for="(column, index) in columns" :key="index">
              {{ column }}
            </th>
            <th v-if="auth === 'admin'">Actions</th>
          <!-- </div> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          

            <td v-for="(cell, colIndex) in row" :key="colIndex">
              <input 
              v-if="auth === 'admin' && typeof cell !== 'number'" 
                v-model="row[colIndex]"
                @change="updateRow(row, rowIndex)" 
                />
                <b v-else>{{ cell }}</b>
           
           </td>
           <td>
            <button v-if="auth === 'admin'" @click="deleteRow(rowIndex)" class="delete-button">Delete</button>
          </td>
        
        </tr>
      </tbody>


    </table>
    <button v-if="auth === 'admin'" @click="addRow" class="add-button">Add Row</button>
  </div>
</template>



<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  auth: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['createRow', 'updateRow', 'deleteRow']);

const addRow = () => {
  const newRow = props.columns.reduce((acc, col) => {
    acc[col] = col === 'ID' ? null : '';
    return acc;
  }, {});
  emit('createRow', newRow);
};

const updateRow = (row, rowIndex) => {
  emit('updateRow', row, rowIndex);
};

const deleteRow = (rowIndex) => {
  emit('deleteRow', rowIndex);
};
</script>

<style scoped>
.table-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #1bbcec;
  color: #0f0000;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

input {
  width: 90%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  cursor: pointer;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
}

.add-button {
  background-color: #2855a7;
  color: white;
}

.add-button:hover {
  background-color: #213088;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
