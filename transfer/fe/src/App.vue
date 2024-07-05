<template>
  <div id="app">
    <div>
      <div class="sidebar">
        <MenuBar auth="user"/>
      </div>
      <!-- <button v-if="auth === 'admin'" @click="goToAdminPage">Admin</button> -->
      <!-- <button v-if="auth === 'admin'" @click="toggleAuth">
        {{ localAuth === 'admin' ? 'User' : 'Admin' }}
      </button> -->
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import MenuBar from './components/MenuBar.vue';

export default {
  name: 'App',
  components: {
    MenuBar,
  },
  setup() {
    const auth = ref(null);
    const localAuth = ref(null); // Local state for toggling auth mode
    const router = useRouter();

    const empId = 'IN011472'; // Hardcoded emp_id for testing

    const fetchAdminData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/check-admin', { empId });
        if (response.data.isAdmin) {
          auth.value = 'admin';
          localAuth.value = 'admin'; // Set local auth to admin initially
        } else {
          auth.value = 'user'; // Set to user if not admin
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    };

    const goToAdminPage = () => {
      if (localAuth.value === 'admin') {
        router.push('/admin'); // Navigate to admin page
      } else {
        router.push('/user'); // Navigate to user page
      }
    };

    const toggleAuth = () => {
      localAuth.value = localAuth.value === 'admin' ? 'user' : 'admin';
      goToAdminPage(); // Update routing based on localAuth value
    };

    onMounted(() => {
      fetchAdminData();
    });

    return {
      auth,
      localAuth,
      goToAdminPage,
      toggleAuth,
    };
  },
};
</script>

<style>
#app {
  display: flex;
  font-family: 'Arial', sans-serif;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f0f0f0;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
