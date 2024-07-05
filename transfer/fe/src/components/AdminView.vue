<template>
    <div id="app">
        <!-- <h1>Admin page</h1> -->
      <!-- <div class="sidebar">
        <MenuBar auth="admin"/>
      </div> -->
      <div class="content">
        <HomePage auth = "admin"/>
      </div>
    </div>
  </template>
  
  <script>
  // import MenuBar from './MenuBar.vue';
  import HomePage from './HomePage.vue';
  // import router from './router';
  // import { useStore } from '../store';

  export default {
    name: 'App',
    components: {
      // MenuBar,
      HomePage
    },
    setup() {
      return {
        // router
      };
    },
    
  }
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
    overflow-y: auto; /* Enable scrolling */
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }
  </style>
  