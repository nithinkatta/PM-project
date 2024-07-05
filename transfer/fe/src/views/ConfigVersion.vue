<template>
    <div class="project-page">
      <h1>Version Configuration</h1>
  
      <!-- Dropdowns -->
      <div class="form-group-row">
        <div class="form-group">
          <label for="dropdown1">Project Type</label>
          <select id="dropdown1" v-model="selectedOption1" @change="handleChangeDropdown1">
            <option v-for="option in dropdown1Options" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="dropdown2">OS Baseline</label>
          <select id="dropdown2" v-model="selectedOption2" @change="handleChangeDropdown2">
            <option v-for="option in dropdown2Options" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="dropdown3">Chipset Platform</label>
          <select id="dropdown3" v-model="selectedOption3" @change="handleChangeDropdown3">
            <option v-for="option in dropdown3Options" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="dropdown4">Project Name</label>
          <select id="dropdown4" v-model="selectedOption4" @change="handleChangeDropdown4">
            <option v-for="option in dropdown4Options" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </div>
      </div>
  
      <!-- Submit Button -->
      <button @click="handleSubmit">Submit</button>
  
      <!-- Display Cards -->
      <div class="card-container" >
       
        <div  v-for="card in versionBlockCards" 
          :key="card.id" 
           
          class="card"
          @click="navigate(card.id,card)">
          <div>
            <h3>{{ card.name }}</h3>
            <p>{{ card.description }}</p>
            <p>Status: {{ card.status }}</p>
          </div>
        
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        selectedOption1: '',
        selectedOption2: '',
        selectedOption3: '',
        selectedOption4: '',
        dropdown1Options: [],
        dropdown2Options: [],
        dropdown3Options: [],
        dropdown4Options: [],
        versionBlockCards: [] // Array to store version block data for cards
      };
    },
    methods: {
      async fetchDropdown1Options() {
        try {
          const response = await axios.get('http://localhost:3000/api/dropdown1');
          this.dropdown1Options = response.data;
        } catch (error) {
          console.error('Error fetching Dropdown 1 options:', error);
        }
      },
      async fetchDropdown2Options() {
        try {
          const response = await axios.get(`http://localhost:3000/api/dropdown2/${this.selectedOption1}`);
          this.dropdown2Options = response.data;
        } catch (error) {
          console.error('Error fetching Dropdown 2 options:', error);
        }
      },
      async fetchDropdown3Options() {
        try {
          const response = await axios.get(`http://localhost:3000/api/dropdown3/${this.selectedOption2}`);
          this.dropdown3Options = response.data;
        } catch (error) {
          console.error('Error fetching Dropdown 3 options:', error);
        }
      },
      async fetchDropdown4Options() {
        try {
          const response = await axios.get(`http://localhost:3000/api/dropdown4/${this.selectedOption3}`);
          this.dropdown4Options = response.data;
        } catch (error) {
          console.error('Error fetching Dropdown 4 options:', error);
        }
      },
      handleChangeDropdown1() {
        this.selectedOption2 = '';
        this.selectedOption3 = '';
        this.selectedOption4 = '';
        this.fetchDropdown2Options();
      },
      handleChangeDropdown2() {
        this.selectedOption3 = '';
        this.selectedOption4 = '';
        this.fetchDropdown3Options();
      },
      handleChangeDropdown3() {
        this.selectedOption4 = '';
        this.fetchDropdown4Options();
      },
      async handleSubmit() {
        // Fetch version block data based on selected option
        const projectId = this.selectedOption4 || this.selectedOption3 || this.selectedOption2 || this.selectedOption1;
        try {
            console.log(projectId)
          const response = await axios.get(`http://localhost:3000/api/version_block/${projectId}`);
          this.versionBlockCards = response.data;
        } catch (error) {
          console.error('Error fetching version block data:', error);
        }
      },
      navigate(id, version) {
        this.$router.push({
          path: `/versions/${id}`,
          query: {
            name: version.value,
            project: this.project,
            auth: 'admin',
            versionBlockId: id
          }
        });
      },
    },
    mounted() {
      this.fetchDropdown1Options();
    }
  };
  </script>
  
  <style scoped>
  .project-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .form-group {
    flex: 1;
    margin-right: 10px;
    margin: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .form-group:last-child {
    margin-right: 0;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .card {
    width: calc(50% - 20px);
    background-color: #ffffff;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }
  
  .card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .card h3 {
    margin-top: 0;
    font-size: 18px;
  }
  
  .card p {
    margin-bottom: 5px;
  }
  </style>
  