<template>
  <div>
    <div class="menu" :class="{ 'small-menu': smallMenu }">
      <button v-if="authReq === 'admin'" @click="toggleAuth">Admin</button>
      <div style="display: flex; justify-content: space-between;">
        <h1 @click="handleProjectClick">Projects</h1>
        <img @click="HomeClick" height="30px" width="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpToiq1IGChAGKq7qXRHs9QzNS1sAShPeUmQ&usqp=CAU" alt="Home">
      </div>
      <div class="form-container" v-if="authReq == 'admin'">
        <input v-model="inputVal" type="text" placeholder="Create new...">
        <select v-model="type">
          <option value="none"></option>
          <option value="folder">Folder</option>
          <option value="file">File</option>
        </select>
        <button @click="handleClick">Add</button>
        <button @click="handleDelete">Delete</button>
      </div>
      <MenuItem
        v-for="(item, index) in menuTree"
        :key="index"
        :id="item.id"
        :data="item.children"
        :label="item.label"
        :icon="item.icon"
        :type="item.type"
        :depth="0"
        :smallMenu="smallMenu"
        :selected-id="selectedId"
        @update-selected="updateSelected"
        :auth="auth"
        @delete-item="deleteMenuItem"
        @rename-item="renameMenuItem"
      />
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from '../store';

export default {
  name: 'MenuBar',
  components: {
    MenuItem
  },
  setup() {
    const authReq = ref(null);
    const localAuth = ref(null);
    const router = useRouter();

    const empId = 'IN011472'; // Replace with actual employee ID

    const fetchAdminData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/check-admin', { empId });
        if (response.data.isAdmin) {
          authReq.value = 'admin';
          localAuth.value = 'admin';
        } else {
          authReq.value = 'user';
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    };

    const goToAdminPage = () => {
      router.push('/admin/config');
    };

    const toggleAuth = () => {
      goToAdminPage();
    };

    onMounted(() => {
      fetchAdminData();
    });

    return {
      authReq,
      localAuth,
      goToAdminPage,
      toggleAuth,
    };
  },
  data() {
    return {
      smallMenu: false,
      menuTree: [],
      inputVal: '',
      type: 'none',
      selectedId: null
    };
  },
  props: {
    auth: String
  },
  created() {
    this.fetchMenuData();
  },
  methods: {
    async fetchMenuData() {
      try {
        const response = await axios.get('http://localhost:3000/api/menu');
        this.menuTree = response.data;
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    },
    async handleClick() {
      const store = useStore();
      if (this.inputVal.trim() !== '') {
        const newData = {
          label: this.inputVal.trim(),
          type: this.type,
          parent_id: store.getID // Assuming store.getID retrieves the parent ID
        };

        try {
          await axios.post('http://localhost:3000/api/menu', newData)
              .then(() => {
              this.fetchMenuData(); // Refresh menu data after deletion
              // this.selectedId = null; // Clear selected item
              
              // Redirect to home page after deletion
              this.HomeClick();
            })
            .catch(error => {
              console.error('Error deleting menu item:', error);
            });
          // const newMenuId = response.data.id; // Capture the new ID from the response

          // if (this.type === 'file') {
          //   const newCard = {
          //     id: newMenuId,
          //     name: this.inputVal.trim(),
          //     usercount: 0,
          //     kernelversion: '',
          //     labels: [
          //       { tab: 'Specifications', text: '', label: 'Type 2' },
          //       { tab: 'Regions', text: '', label: 'Type 2' },
          //       { tab: 'Basic', text: 'temp', label: 'Active users' }
          //     ]
          //   };

          //   try {
          //     await axios.post('http://localhost:3000/api/projects', newCard);
          //     this.fetchMenuData();
          //   } catch (error) {
          //     console.error('Error creating new project:', error);
          //   }
          // }

          await this.fetchMenuData(); // Refresh menu data after successful insertion
          this.inputVal = ''; // Clear input after successful insertion
        } catch (error) {
          console.error('Error inserting data:', error);
        }
      }
    },
    handleDelete() {
  if (window.confirm(`Are you sure you want to delete '${this.selectedId}'?`)) {
    if (this.selectedId) {
      const selectedItem = this.menuTree.find(item => item.id === this.selectedId);
      if (selectedItem && selectedItem.type === 'folder') { // Check if selectedItem exists
        const hasFiles = selectedItem.children && selectedItem.children.length > 0;
        if (hasFiles) {
          alert("Cannot delete folder with files inside.");
          return;
        }
      }
      this.deleteMenuItem(this.selectedId);
    }
  }
},


    deleteMenuItem(id) {
      // Optional: Add confirmation dialog before deletion
      axios.delete(`http://localhost:3000/api/menu/${id}`)
        .then(() => {
          this.fetchMenuData(); // Refresh menu data after deletion
          this.selectedId = null; // Clear selected item
          
          // Redirect to home page after deletion
          this.HomeClick();
        })
        .catch(error => {
          console.error('Error deleting menu item:', error);
        });
    },
    updateSelected(id) {
      this.selectedId = id;
    },
    HomeClick() {
      this.$router.push('/');
      const store = useStore();
      store.updateType('folder');
    },
    renameMenuItem(id, newLabel) {
      // Handle renaming logic (update label in the database or store)
      axios.put(`http://localhost:3000/api/menu/${id}`, { label: newLabel })
        .then(() => {
          this.fetchMenuData(); // Refresh menu data after renaming
        })
        .catch(error => {
          console.error('Error renaming menu item:', error);
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.menu {
  position: fixed;
  height: 100vh;
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  // padding: px;
  margin-right:10px;
}

.menu h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-container {
  margin-bottom: 20px;
}

.form-container input {
  width: calc(100% - 100px);
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.form-container select {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.form-container button {
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}

.menu.small-menu {
  width: 60px;
}
</style>
