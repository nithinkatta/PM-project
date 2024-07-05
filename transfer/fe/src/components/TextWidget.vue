<template>
  <div>
    <h2>Menu Hierarchy with Version Block Data</h2>
    <div v-if="menuItemsByMonth.length">
      <div v-for="monthData in menuItemsByMonth" :key="monthData.month" class="month-card">
        <h3>{{ monthData.monthName }}</h3>
        <div v-for="menuItem in monthData.menuItems" :key="menuItem.id" class="menu-item-card">
          <h4>{{ menuItem.label }}</h4>
          <p>Path: {{ menuItem.path }}</p>
          <p>Root Parent: {{ menuItem.root_parent }}</p>
          <div v-if="menuItem.versionBlocks.length">
            <div v-for="versionBlock in menuItem.versionBlocks" :key="versionBlock.id" class="version-block-card">
              <p>Version ID: {{ versionBlock.id }}</p>
              <p>Deadline: {{ versionBlock.deadline }}</p>
            </div>
          </div>
          <p v-else>No version blocks for this item.</p>
        </div>
      </div>
    </div>
    <p v-else>No menu items found.</p>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      menuItems: [],
      menuItemsByMonth: []
    };
  },
  mounted() {
    this.fetchMenuHierarchy();
  },
  methods: {
    async fetchMenuHierarchy() {
      try {
        const response = await axios.get('http://localhost:3000/api/menuHierarchy');
        const rawData = response.data;

        // Process the raw data to group version blocks under their corresponding menu items
        const menuItemsMap = new Map();

        rawData.forEach(item => {
          if (!menuItemsMap.has(item.id)) {
            menuItemsMap.set(item.id, {
              id: item.id,
              label: item.label,
              path: item.path,
              root_parent: item.root_parent,
              versionBlocks: []
            });
          }
          menuItemsMap.get(item.id).versionBlocks.push({
            id: item.id,
            deadline: item.deadline
          });
        });

        // Convert the map to an array and sort by deadline
        const menuItems = Array.from(menuItemsMap.values()).map(item => {
          item.versionBlocks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
          return item;
        });

        // Group menu items by month
        const menuItemsByMonth = {};

        menuItems.forEach(item => {
          item.versionBlocks.forEach(block => {
            const month = moment(block.deadline).format('YYYY-MM');
            if (!menuItemsByMonth[month]) {
              menuItemsByMonth[month] = {
                month,
                monthName: moment(block.deadline).format('MMMM YYYY'),
                menuItems: []
              };
            }
            const existingMenuItem = menuItemsByMonth[month].menuItems.find(mi => mi.id === item.id);
            if (existingMenuItem) {
              existingMenuItem.versionBlocks.push(block);
            } else {
              menuItemsByMonth[month].menuItems.push({
                ...item,
                versionBlocks: [block]
              });
            }
          });
        });

        // Convert to array and sort by month
        this.menuItemsByMonth = Object.values(menuItemsByMonth).sort((a, b) => moment(a.month).isBefore(moment(b.month)) ? -1 : 1);
      } catch (error) {
        console.error('Error fetching menu hierarchy:', error);
      }
    }
  }
};
</script>

<style>
.month-card {
  border: 2px solid #000;
  padding: 16px;
  margin: 16px 0;
  border-radius: 8px;
  background-color: #eef;
}

.menu-item-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 16px 0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.version-block-card {
  border: 1px solid #ccc;
  padding: 8px;
  margin: 8px 0;
  border-radius: 4px;
  background-color: #fff;
}
</style>
