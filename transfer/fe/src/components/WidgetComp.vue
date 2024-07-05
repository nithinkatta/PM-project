<template>
  <div>
  
    <div class="widget-block">

      <div class="block-header">
        <h3 v-if="!editingTitle" style="color: slategray">{{ title }}</h3>
      <input v-if="editingTitle" v-model="newTitle" @keyup.enter="saveTitle" @blur="saveTitle" type="text" class="input" />
      <div class="block-actions" v-if="auth=='admin'">
        <button @click="toggleEditTitle" class="button is-small">{{ editingTitle ? 'Cancel' : 'Rename' }}</button>
        <!-- <button @click="deleteBlock" class="button is-small is-danger">Delete</button> -->
        <span class="delete-label" @click="deleteBlock">
          <img   src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" alt="Delete Label">
        </span>
      </div>
    </div>
    <div class="widget-card" v-for="(widget, index) in widgets" :key="index">
      <div v-if="widget.editable">
        <input v-model="widget.label" type="text" class="input label-input" />
        <input v-model="widget.value" type="text" class="input value-input" />
        <div class="button-group" v-if="auth=='admin'">
          <button @click="updateWidget(widget)" class="button is-small is-primary">Update</button>
          <!-- <button @click="deleteWidget(widget)" class="button is-small is-danger">Delete</button> -->
          <span class="delete-label" @click="deleteWidget(widget)">
            <img src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" alt="Delete Label">
          </span>
        </div>
      </div>
      <div v-else>
        <div class="label-value-pair">
          <span class="label">{{ widget.label }}:</span>
          <span class="value">{{ widget.value }}</span>
        </div>
        <button v-if="auth == 'admin'" @click="editWidget(widget)" class="button is-small is-secondary">Edit</button>
      </div>
    </div>
    <div class="add-widget" v-if="auth == 'admin'">
      <input v-model="newWidget.label" type="text" placeholder="Label" class="input new-label-input" />
      <input v-model="newWidget.value" type="text" placeholder="Value" class="input new-value-input" />
      <button @click="addWidget" class="button is-primary">Add Widget</button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    widgets: {
      type: Array,
    },
    auth:{
      type: String
    }
  },
  data() {
    return {
      editingTitle: false,
      newTitle: this.title,
      newWidget: {
        label: '',
        value: ''
      }
    };
  },
  methods: {
    toggleEditTitle() {
      this.editingTitle = !this.editingTitle;
      if (!this.editingTitle) {
        this.newTitle = this.title;
      }
    },
    saveTitle() {
      if (this.newTitle !== this.title) {
        this.$emit('update-title', this.newTitle);
      }
      this.editingTitle = false;
    },
    deleteBlock() {
      this.$emit('delete-block');
    },
    editWidget(widget) {
    widget.editable = true;
  },
  async updateWidget(widget) {
    try {
      const response = await axios.put(`http://localhost:3000/api/widgets/${widget.id}`, widget);
      if (response.status === 200) {
        widget.editable = false;
        console.log('Widget updated:', response.data);
      } else {
        console.error('Error updating widget:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  },
  async deleteWidget(widget) {
    try {
      const response = await axios.delete(`http://localhost:3000/api/widgets/${widget.id}`);
      if (response.status === 200) {
        const index = this.widgets.findIndex(w => w === widget);
        if (index !== -1) {
          const updatedWidgets = [...this.widgets.slice(0, index), ...this.widgets.slice(index + 1)];
          this.$emit('update:widgets', updatedWidgets);
        }
        console.log('Widget deleted:', response.data);
      } else {
        console.error('Error deleting widget:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  },
    addWidget() {
      const { label, value } = this.newWidget;
      if (label && value) {
        const newWidget = { label, value, editable: false };
        this.$emit('add-widget', newWidget);
        this.newWidget.label = '';
        this.newWidget.value = '';
      }
    }
  }
};
</script>

<style scoped>
.widget-block {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.block-actions {
  display: flex;
  gap: 10px;
}

.widget-card {
  border: 1px solid #e0e0e0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #fafafa;
  width :500px;
}

.label-value-pair {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.label {
  font-weight: bold;
  margin-right: 10px;
}

.delete-label {
  cursor: pointer;
  margin-left: 10px;
}

.delete-label img {
  width: 30px;
  height: 30px;
}


.value {
  flex: 1;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.button {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #007bff;
  transition: background-color 0.3s ease;
}

.button.is-primary {
  background-color: #007bff;
}

.button.is-secondary {
  background-color: #6c757d;
}

.button.is-danger {
  background-color: #dc3545;
}

.button:hover {
  background-color: #0056b3;
}

.add-widget {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>


