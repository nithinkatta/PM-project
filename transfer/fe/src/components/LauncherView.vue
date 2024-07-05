<template>
  <div class="lander">
    <div v-if="tab === 'Basic'" class="project-details-grid">
      <div v-for="(detail, index) in projectDetails" :key="index" class="detail-item">
        <strong>{{ detail.label }}:</strong> <span>{{ detail.text }}</span>
      </div>
    </div>

    <div class="add-label-widget" v-show="auth === 'admin'">
      <div class="add-label" @click="showOptions = !showOptions">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Plus_symbol.svg" alt="Add Label">
        <span>Select Label</span>
      </div>

      <div class="options-slider" v-show="showOptions">
        <label v-for="(type, index) in labelTypes[computedTabIndex]" :key="index">
          <input type="checkbox" v-model="selectedTypes" :value="type"> {{ type }}
        </label>
        <button @click="createNewLabel">Go!</button>
      </div>
    </div>

    <div v-if="auth === 'admin'" class="labels-container">
      <div v-for="(item, index) in labels" :key="index" class="label-item">
        <div class="label-row">
          <div class="label-header">{{ item.label }}:</div>
          <input v-model="item.text" class="label-text-input" placeholder="Enter text">
          <span class="delete-label" @click="deleteLabel(index, item)">
            <img src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" alt="Delete Label">
          </span>
        </div>
      </div>
    </div>

    <div v-else class="project-details-grid">
      <div v-for="(item, index) in labels" :key="index" class="detail-item">
        <strong>{{ item.label }}:</strong> <span>{{ item.text }}</span>
      </div>
    </div>
    <div class="save-button" v-show="auth === 'admin'">
      <button @click="saveLabels">Save Labels</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LanderPage',
  props: ['id', 'tab', 'projectDetails', 'auth'],
  data() {
    return {
      labels: [],
      showOptions: false,
      selectedTypes: [],
      labelTypes: [
        ['Version Control', 'Task updated', 'Current User', 'New deadline', 'Milestone', 'Status update', 'Deadlines', 'Active users'],
        ['Brand', 'Model', 'Operating system', 'Display', 'Processor', 'RAM', 'Deadlines', 'Storage', 'Camera', 'Battery'],
        ['North America', 'India', 'United States', 'China', 'Head Quarters', 'Japan'],
        ['Head Quarters', 'Services', 'Updations', 'Requirements', 'Milestone', 'Status update', 'Deadlines', 'Active users'],
        ['Version Control', 'Task updated', 'Tested by', 'Version Review', 'Model version', 'Launch date']
      ],
    };
  },
  computed: {
    computedTabIndex() {
      switch (this.tab) {
        case 'Basic':
          return 0;
        case 'Specifications':
          return 1;
        case 'Regions':
          return 2;
        case 'Operators':
          return 3;
        case 'VersionQuality':
          return 4;
        default:
          return 0; // Default to 'Basic' if no matching tab
      }
    }
  },
  methods: {
    createNewLabel() {
      this.selectedTypes.forEach(type => {
        const newLabel = { label: type, text: '' };
        this.labels.push(newLabel);
      });
      this.showOptions = false;
      this.selectedTypes = [];
    },
    async deleteLabel(index, item) {
      try {
        this.labels.splice(index, 1); // Remove label from frontend state

        // Update the project with the remaining labels
        const updatedLabels = this.labels.map(label => ({ ...label, tab: this.tab }));

        // Update the project with the merged labels
        await axios.put(`http://localhost:3000/api/projects/${this.id}`, {
          labels: updatedLabels
        });

        console.log('Label deleted:', item);
      } catch (error) {
        console.error('Error deleting label:', error);
      }
    },
    async saveLabels() {
      try {
        // Fetch the current project data
        const response = await axios.get(`http://localhost:3000/api/projects/${this.id}`);
        const project = response.data[0];

        // Existing labels in the backend
        const existingLabels = project.labels || [];

        // Filter out labels that already exist in `this.labels`
        const newLabels = this.labels.filter(label => !existingLabels.some(el => el.label === label.label && el.text === label.text && el.tab === this.tab));

        // Merge existing labels with new labels
        const updatedLabels = existingLabels.concat(newLabels.map(label => ({ ...label, tab: this.tab })));

        // Update the project with the merged labels
        await axios.put(`http://localhost:3000/api/projects/${this.id}`, {
          labels: updatedLabels
        });

        console.log('Labels saved:', updatedLabels);
      } catch (error) {
        console.error('Error saving labels:', error);
      }
    },
    async fetchProject() {
      try {
        const response = await axios.get(`http://localhost:3000/api/projects/${this.id}`);
        const project = response.data[0];
        this.labels = project.labels ? project.labels.filter(label => label.tab === this.tab) : [];
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    },
    async clearLocalLabels() {
      this.labels = []; // Clear locally stored labels
    }
  },
  created() {
    this.fetchProject();
  },
  beforeRouteLeave(to, from, next) {
    this.clearLocalLabels(); // Clear labels when leaving the route
    next();
  }
};
</script>

<style scoped>
.lander {
  position: relative;
  padding: 20px;
  text-align: center;
}

.project-details-grid {
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack checkboxes vertically */
  align-items: flex-start;
}

.detail-item strong {
  font-weight: bold;
}

.labels-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Grid layout */
  gap: 20px; /* Space between grid items */
  margin-top: 20px;
}

.label-item {
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.label-item:hover {
  transform: scale(1.05);
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label-header {
  font-size: 16px;
  font-weight: bold;
  flex: 1;
}

.label-text-input {
  margin-left: 10px;
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 2;
}

.delete-label {
  cursor: pointer;
  margin-left: 10px;
}

.delete-label img {
  width: 30px;
  height: 30px;
}

.add-label-widget {
  position: absolute;
  top: 20px;
  right: 20px;
}

.add-label {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-label img {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.options-slider {
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack checkboxes vertically */
  align-items: flex-start;
  top: 50px;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.options-slider label {
  display: block;
  margin-bottom: 8px;
}

.options-slider button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.options-slider button:hover {
  background-color: #45a049;
}

.save-button {
  position: absolute;
  top: 20px;
  right: 170px;
}

.save-button button {
  padding: 12px 24px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  height: 35px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button button:hover {
  background-color: #0b7dda;
}
</style>
