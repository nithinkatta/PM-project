<template>
  <div class="version-scope-page">
    <div class="header">
      <h1>{{ project }} {{ name }}</h1>
      <div v-if="auth === 'admin'" class="admin-controls">
        <button @click="addNewLabel" class="btn-add-label">Add Label</button>
        <button @click="saveLabels" class="btn-save-labels">Save</button>
      </div>
    </div>

    <div v-for="(field, index) in inputFields" :key="field.id || index" class="input-group">
      <div v-if="auth === 'user'" class="field-display">
        <strong class="field-name">{{ field.name }}: </strong>
        <span v-if="isLink[index]" class="field-value"><a :href="field.value" target="_blank">Link</a></span>
        <span v-else class="field-value">{{ field.value }}</span>
      </div>
      <div v-else>
        <input 
          v-model="field.name" 
          placeholder="Enter label name" 
          class="input-field" 
          @blur="updateInputField(index, field)" 
        />
        <input 
          v-model="field.value" 
          placeholder="Enter label value" 
          class="input-field" 
          @blur="updateInputField(index, field)" 
        />
        <img 
          v-if="auth === 'admin'"
          src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" 
          alt="Delete" 
          @click="deleteInputField(field.id, index)" 
          class="delete-icon"
        />
        <span class="tooltip">Delete</span>
      </div>
    </div>
    
    <h1>Version Scope</h1>
    <ul class="version-scope">
      <li v-for="(item, idx) in versionScope" :key="idx">
        <div v-if="!item.editMode" class="item-display">
          <a :href="item.link" @click="navigateToUrl(item.link)">{{ item.label }}</a>
        </div>
        <div v-else>
          <input 
            v-model="item.label" 
            placeholder="Enter label" 
            class="input-field" 
          />
        </div>
        <button 
          @click="auth === 'admin' && toggleStatus(item,idx)" 
          :class="{'completed': item.completed, 'pending': !item.completed, 'disabled': auth === 'user'}"
        >
          {{ item.completed ? 'Completed' : 'Pending' }}
        </button>
        <button v-if="item.editMode" @click="saveLink(item,idx)">Save</button>
        <img 
          v-else-if="auth === 'admin'"
          src="data:image/png;base64,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"
          alt="edit" 
          @click="editLink(idx)" 
          class="edit-icon"
        />
        <img 
          v-if="auth === 'admin'"
          src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" 
          alt="Delete" 
          @click="deleteLink(item.id, idx)" 
          class="delete-icon"
        />
        <img
          v-if="auth === 'admin'"
          src="https://w7.pngwing.com/pngs/457/165/png-transparent-computer-icons-hyperlink-link-miscellaneous-blue-text.png"
          alt="Bind URL"
          @click="addUrl(idx)"
          class="link-icon"
        />
      </li>
      <li>
        <button v-if="auth === 'admin'" @click="addNewVersionScopeItem" class="btn-add-item">Add New Item</button>
      </li>
    </ul>
    
    <button class="send-to-tt-btn">SEND to TT</button>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      project: '',
      auth: '',
      isLink:[],
      inputFields: [],
      versionScope: [],
      newItems: []
    };
  },
  created() {
    const routeQuery = this.$route.query;
    this.name = routeQuery.name;
    this.project = routeQuery.project;
    this.auth = routeQuery.auth;

    this.fetchInputFields();
    this.fetchVersionScope();
  },
  methods: {
    async fetchInputFields() {
      try {
        const response = await axios.get(`http://localhost:3000/api/input_fields/${this.$route.query.versionBlockId}`);
        this.inputFields = response.data;
        console.log("data fetched");
        this.validatorLinks();
      } catch (error) {
        console.error('Error fetching input fields:', error);
      }
    },
    async fetchVersionScope() {
      try {
        const response = await axios.get(`http://localhost:3000/api/version_scope/${this.$route.query.versionBlockId}`);
        this.versionScope = response.data;
      } catch (error) {
        console.error('Error fetching version scope:', error);
      }
    },
    addNewLabel() {
      const newField = { name: '', value: '', version_block_id: this.$route.query.versionBlockId };
      this.inputFields.push(newField);
      this.isLink.push(false);
    },
    async saveLabels() {
      try {
        const newFields = this.inputFields.filter(field => !field.id);
        if (newFields.length) {
          const response = await axios.post('http://localhost:3000/api/input_fields', newFields);
          this.inputFields = this.inputFields.map(field => {
            const updatedField = response.data.find(f => f.name === field.name && f.value === field.value);
            return updatedField ? { ...field, id: updatedField.id } : field;
          });
        } else {
          await axios.put('http://localhost:3000/api/input_fields', this.inputFields);
        }
      } catch (error) {
        console.error('Error saving labels:', error);
      }

      // if(this.newItems)
      // try{
      //   const response = axios.post('http://localhost:3000/api/version_scope', this.newItem);
      //   console.log(response);
      // }
      // catch(error){
      //   console.error('Error adding new version scope item:', error);
      // }

    },
    async updateInputField(index, field) {
      if (field.id) {
        try {
          await axios.put(`http://localhost:3000/api/input_fields/${field.id}`, field);
        } catch (error) {
          console.error('Error updating input field:', error);
        }
      } else {
        try {
          const response = await axios.post('http://localhost:3000/api/input_fields', field);
          this.$set(this.inputFields, index, response.data);
        } catch (error) {
          console.error('Error saving new input field:', error);
        }
      }
    },
    async deleteInputField(id, index) {
      if (id) {
        try {
          await axios.delete(`http://localhost:3000/api/input_fields/${id}`);
        } catch (error) {
          console.error('Error deleting input field:', error);
        }
      }
      this.inputFields.splice(index, 1);
    },
    toggleStatus(item,index) {
      if (this.auth === 'admin') {
        this.versionScope[index].completed = !this.versionScope[index].completed;
        this.updateVersionScope(item,index);
      }
    },
    addUrl(index) {
      const url = window.prompt('Enter the URL:');
      if (url) {
        this.versionScope[index].link = url;
        this.updateVersionScope(index);
      }
    },
    navigateToUrl(url) {
      if (url) {
        window.open(url, '_blank');
      }
    },
    editLink(index) {
      this.versionScope[index].editMode = true;
    },
    async saveLink(item,index) {
      console.log(index);
      this.versionScope[index].editMode = false;
      this.updateVersionScope(item,index);
    },
    async deleteLink(id, index) {
      try {
        await axios.delete(`http://localhost:3000/api/version_scope/${id}`);
        this.versionScope.splice(index, 1);
      } catch (error) {
        console.error('Error deleting version scope:', error);
      }
    },
    async updateVersionScope(item,index) {
      try {
        //const item = this.versionScope[index];
        console.log(index,item);
        await axios.put(`http://localhost:3000/api/version_scope/${item.id}`, item);
        console.log("updated");
      } catch (error) {
        console.error('Error updating version scope:', error);
      }
    },
    addNewVersionScopeItem() {
      const newItem = { label: '', completed: false, editMode: false, version_block_id: this.$route.query.versionBlockId };
      try{
        const response = axios.post('http://localhost:3000/api/version_scope', newItem);
        console.log(response);
      }
      catch(error){
        console.error('Error adding new version scope item:', error);
      }

      this.newItems = newItem;
      this.versionScope.push(newItem);
    },
    validatorLinks(){
      console.log("Entered here");

      const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
       for(let i=0;i<this.inputFields.length;i++){
        console.log(this.inputFields[i].value.match(urlPattern))
         if(this.inputFields[i].value.match(urlPattern)){
           this.isLink.push(true);
          }else
          {
           this.isLink.push(false);
         }
       }
       console.log(this.isLink[3]);    
      }
  }
};
</script>


<style scoped>
.version-scope-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-controls {
  display: flex;
}

.btn-add-label, .btn-add-link, .btn-save-labels, .btn-add-item {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #1bbcec;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add-label:hover, .btn-add-link:hover, .btn-save-labels:hover, .btn-add-item:hover {
  background-color: #1399b2;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}

.input-field {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.delete-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.link-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.edit-icon{
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.tooltip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%; 
  left: 50%; 
  margin-left: -30px; 
  width: 60px;
}

.input-group:hover .tooltip {
  visibility: visible;
}

.version-scope {
  list-style-type: none;
  padding: 0;
}

.version-scope li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.version-scope li button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.version-scope li .completed {
  background-color: green;
  color: white;
}

.version-scope li .pending {
  background-color: red;
  color: white;
}

.version-scope li .disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.send-to-tt-btn {
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #1bbcec;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-to-tt-btn:hover {
  background-color: #1399b2;
}
</style>
