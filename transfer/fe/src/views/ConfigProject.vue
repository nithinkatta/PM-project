<template>
  <div class="project-page">
    <h1>Project Configuration</h1>

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

    <button @click="handleSubmit">Submit</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      label: '',
      usercount: '25',
      kernelversion: '4.4.5',
      selectedOption1: '',
      selectedOption2: '',
      selectedOption3: '',
      selectedOption4: '',
      dropdown1Options: [],
      dropdown2Options: [],
      dropdown3Options: [],
      dropdown4Options: []
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
        console.log(this.dropdown4Options)
      } catch (error) {
        console.error('Error fetching Dropdown 4 options:', error);
      }
    },
    // async fetchLabel() {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/label/${this.selectedOption4}`);
    //     this.label = response.data.label;
    //   } catch (error) {
    //     console.error('Error fetching label:', error);
    //   }
    // },
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
      const selectedOption = this.dropdown3Options.find(option => option.id === this.selectedOption3);
      if (selectedOption) {
        this.label = selectedOption.label;
        // this.usercount = selectedOption.usercount;
        // this.kernelversion = selectedOption.kernelversion;
      } else {
        console.warn('Selected option not found in dropdown4Options.');
        this.label = '';
      }
      this.fetchDropdown4Options();
    },
    async handleChangeDropdown4() {
      // await this.fetchLabel();
      const selectedOption = this.dropdown4Options.find(option => option.id === this.selectedOption4);
      if (selectedOption) {
        this.label = selectedOption.label;
        // this.usercount = selectedOption.usercount;
        // this.kernelversion = selectedOption.kernelversion;
      } else {
        console.warn('Selected option not found in dropdown4Options.');
        this.label = '';
      }

    },
    async handleSubmit() {
      let selectedOption = '';

      if (this.selectedOption4) {
        selectedOption = this.selectedOption4;
      } else if (this.selectedOption3) {
        selectedOption = this.selectedOption3;
      } else if (this.selectedOption2) {
        selectedOption = this.selectedOption2;
      } else if (this.selectedOption1) {
        selectedOption = this.selectedOption1;
      }
      console.log(this.label)
      console.log(this.usercount)
      console.log(this.kernelversion)
      if (selectedOption) {
        this.$router.push({
          path: `/projects/${selectedOption}`,
          query: {
            name:  this.label,
            usercount: this.usercount,
            kernelversion: this.kernelversion
          }
        });
      } else {
        console.warn('No project type selected.');
      }
    }
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
</style>
