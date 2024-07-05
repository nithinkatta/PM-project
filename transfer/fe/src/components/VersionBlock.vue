<template>
    <div class="version-block">
      <!-- <h1>{{ project }}</h1> -->
      <button v-if="auth === 'admin'" @click="addVersionCard" class="add-version-btn">Add Widget</button>
      <div v-for="(version, index) in versions" :key="version.id" class="version-card">
        <div style="display: flex; justify-content: space-between;">

          <div class="input-group">
            <input v-if="auth === 'admin'" v-model="version.name" placeholder="Enter label name" class="input-field" @blur="updateVersionCard(index, version)" />
            <label v-else ><b>{{ version.name }}</b></label>
            
            <input v-if="auth  === 'admin'" v-model="version.value" placeholder="Enter label value" class="input-field" @blur="updateVersionCard(index, version)" />
            <!-- <button v-if="auth === 'admin'" @click="addUrl(index)" class="link-btn">Add Link</button> -->
            <label v-else>:&nbsp;<b>{{ version.value }}</b></label>
          </div>
          <div>
            <!-- <button v-if="auth === 'admin'" @click="deleteVersionCard(index)" class="delete-btn">Delete</button> -->
            <img v-if="auth === 'admin'" @click="deleteVersionCard(index)" class="redirect-icon" src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" alt="Delete Label">
            <img src="https://thumb.ac-illust.com/70/706d6adcad2675823ada4ed023ff1e3b_t.jpeg" alt="Redirect" @click="navigateToVersionScope(version.id,version)" class="redirect-icon">
          </div>
        </div>
        <div class="input-group">
          <select v-if="auth === 'admin'" v-model="version.status" class="status-dropdown" @change="updateVersionCard(index, version)">
            <option>To be Prepared</option>
            <option>Delivered</option>
            <option>Delayed</option>
            <option>Rejected</option>
          </select>
          <label v-else><b>Status:</b> {{ version.status }}</label>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['project', 'auth', 'id'],
    data() {
      return {
        versions: []
      };
    },
    computed: {
      canUpdate() {
        return this.auth === 'admin';
      }
    },
    methods: {
      async fetchVersions() {
        try {
          console.log(this.id);
          const response = await axios.get(`http://localhost:3000/api/version_block/${this.id}`);
          this.versions = response.data;
        } catch (error) {
          console.error('Error fetching versions:', error);
        }
      },
      async addVersionCard() {
        const newVersion = {
          name: '',
          value: '',
          url: '',
          status: 'To be Prepared',
          project_id: this.id
        };
        try {
          const response = await axios.post('http://localhost:3000/api/version_block', newVersion);
          this.versions.push(response.data);
        } catch (error) {
          console.error('Error adding version:', error);
        }
      },
      addUrl(index) {
        const url = window.prompt('Enter the URL:');
        if (url) {
          this.versions[index].url = url;
          this.updateVersionCard(index, this.versions[index]);
        }
      },
      navigateToUrl(url) {
        if (url) {
          window.open(url, '_blank');
        }
      },
      async updateVersionCard(index, version) {
        try {
          await axios.put(`http://localhost:3000/api/version_block/${version.id}`, version);
        } catch (error) {
          console.error('Error updating version:', error);
        }
      },
      navigateToVersionScope(id, version) {
        this.$router.push({
          path: `/versions/${id}`,
          query: {
            name: version.value,
            project: this.project,
            auth: this.auth,
            versionBlockId: id
          }
        });
      },
      async deleteVersionCard(index) {
        const version = this.versions[index];
        try {
          await axios.delete(`http://localhost:3000/api/version_block/${version.id}`);
          this.versions.splice(index, 1);
        } catch (error) {
          console.error('Error deleting version:', error);
        }
      }
    },
    mounted() {
      this.fetchVersions();
    }
  };
  </script>
  
  <style scoped>
  .version-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
  }
  
  .add-version-btn {
    align-self: flex-end;
    margin-bottom: 10px;
    padding: 10px 20px;
    background-color: #1bbcec;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .add-version-btn:hover {
    background-color: #1399b2;
  }
  
  .version-card {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    width: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .input-field {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .input-field.clickable {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  
  .link-btn {
    margin-left: 10px;
    padding: 10px 15px;
    background-color: #1bbcec;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .link-btn:hover {
    background-color: #1399b2;
  }
  
  .status-dropdown {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    flex: 1;
  }

  .delete-btn {
  margin-left: 10px;
  padding: 10px 15px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: darkred;
}

.redirect-icon
{
   width: 40px;
  height: 30px;
  cursor: pointer;
  margin-left: 5px;
}
  </style>
  