<template>
  <div class="container mt-4">
    <h2>{{ category }} Details</h2>
    <ul>
      <li v-for="item in children" :key="item.id">
        {{ item.label }}
        <ul v-if="item.children">
          <li v-for="child in item.children" :key="child.id">{{ child.label }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['category', 'titleId'],
  data() {
    return {
      children: []
    };
  },
  created() {
    this.fetchChildren();
  },
  methods: {
    async fetchChildren() {
      try {
        const response = await axios.get(`http://localhost:3000/api/menu_items/${this.category}`, {
          params: {
            titleId: this.titleId
          }
        });
        this.children = response.data;
      } catch (error) {
        console.error(`Error fetching ${this.category} details:`, error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
