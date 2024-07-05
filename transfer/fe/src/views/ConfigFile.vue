<template>
  <div class="nav-links">
    <router-link to="/admin/config/HomePage" class="link">HomePage Configuration</router-link><br>
    <router-link to="/admin/config/Projects" class="link">Project Configuration</router-link><br>
    <router-link to="/admin/config/Versions" class="link">Version Configuration</router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.nav-links {
  text-align: center;
  margin-top: 50px;
  margin: 50px;
}

.link {
  display: block;
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.link:hover {
  background-color: #0056b3;
}
</style>
