<template>
  <div class="menu-item" :class="{ opened: expanded, isSelected: isSelected, renaming: renaming }">
    <div
      class="label"
      @click="handleClick()"
      @dblclick="toggleRename()"
      :style="{ paddingLeft: depth * 20 + 20 + 'px' }"
    >
      <div class="left">
        <i v-if="icon" class="material-icons-outlined">{{ icon }}</i>
        <span v-if="showLabel && !renaming">{{ label }}</span>
        <input v-model="newLabel" v-if="renaming" @keydown.enter="renameItem" @blur="cancelRename" type="text">
      </div>
      <div class="right">
        <!-- <button @click.stop="handleDelete">Delete</button> -->
        <i v-if="data && data.length > 0" class="expand material-icons" :class="{ opened: expanded }">expand_more</i>
      </div>
    </div>
    <div
      v-show="showChildren"
      :class="{ 'small-menu': smallMenu }"
      class="items-container"
      :style="{ height: containerHeight }"
      ref="container"
    >
      <MenuItem
        :class="{ opened: showChildren, }"
        v-for="(item, index) in data"
        :key="index"
        :id="item.id"
        :data="item.children"
        :label="item.label"
        :type="item.type"
        :icon="item.icon"
        :depth="depth + 1"
        :smallMenu="smallMenu"
        :selected-id="selectedId"
        :auth="auth"
        @update-selected="updateSelected"
        @delete-item="handleDeleteItem"
        @rename-item="renameItem"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from "../store";
import axios from "axios";
export default {
  name: "MenuItem",
  props: {
    id: {
      type: Number,
    },
    data: {
      type: Array,
    },
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    depth: {
      type: Number,
    },
    smallMenu: {
      type: Boolean,
    },
    type: {
      type: String,
      default: 'file'
    },
    selectedId: {
      type: Number,
    },
    auth: {
      type: String,
    }
  },
  data() {
    return {
      showChildren: false,
      expanded: false,
      containerHeight: 0,
      isSelected: true,
      renaming: false,
      newLabel: '',
      store: useStore(),
      // isSelected: false,
    };
  },
  watch: {
    selectedId(newVal) {
      this.isSelected = this.id === newVal;
    },
  },
  computed: {
    showLabel() {
      return this.smallMenu ? this.depth > 0 : true;
    },
  },
  methods: {
    handleClick() {
      if (!this.renaming) {
        this.isSelected = true;
        this.$emit('update-selected', this.id);
        const store = useStore();
        store.updateData(this.label);
        store.updateType(this.type);
        store.updateID(this.id);
  
        if (this.type === 'file') {
          if (this.auth === 'admin') {
            this.$router.push({
              path: `/projects/${this.id}`,
              query: {
                name: this.label,
              }
            });
          } else {
            this.$router.push({
              path: `/user/projects/${this.id}`,
              query: {
                name: this.label,
              }
            });
          }
          // setTimeout(() => {
          //   location.reload();
          // }, 1);
          // this.toggleMenu();
          this.$nextTick(() => {
        // any additional logic after route change
      });
        } else {
          this.toggleMenu();
        }
      }
    },
    handleDelete() {
      const isFolder = this.type === 'folder';
      const hasChildren = this.data && this.data.length > 0;
      
      if (isFolder) {
        if (!hasChildren) {
          this.$emit('delete-item', this.id);
        } else {
          alert("Cannot delete folder with files inside.");
        }
      }
    },


    toggleMenu() {
      this.expanded = !this.expanded;
      if (!this.showChildren) {
        this.showChildren = true;
        this.$nextTick(() => {
          this.containerHeight = this.$refs["container"].scrollHeight + "px";
          setTimeout(() => {
            this.containerHeight = "fit-content";
            if (navigator.userAgent.indexOf("Firefox") != -1) 
              this.containerHeight = "-moz-max-content";
            this.$refs["container"].style.overflow = "visible";
          }, 300);
        });
      } else {
        this.containerHeight = this.$refs["container"].scrollHeight + "px";
        this.$refs["container"].style.overflow = "hidden";
        setTimeout(() => {
          this.containerHeight = 0 + "px";
        }, 10);
        setTimeout(() => {
          this.showChildren = false;
        }, 300);
      }
    },
    updateSelected(id) {
      this.$emit('update-selected', id);
    },
    handleDeleteItem(id) {
      this.$emit('delete-item', id);
    },
    toggleRename() {
      this.renaming = true;
      this.newLabel = this.label;
      // Optionally, focus the input for immediate editing
      this.$nextTick(() => {
        const input = this.$el.querySelector('input');
        if (input) input.focus();
      });
    },
    async fetchMenuData() {
      try {
        const response = await axios.get('http://localhost:3000/api/menu');
        this.menuTree = response.data;
        
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    },
    renameItem() {
      // if (this.newLabel.trim() !== '') {
      //   console.log('Renaming to:', this.newLabel);
      //   this.renaming = false;
      //   this.$emit('rename-item', this.id, this.newLabel); // Emit event to parent component
      // } else {
      //   console.warn('New label cannot be empty');
      //   this.cancelRename();
      // }
      axios.put(`http://localhost:3000/api/menu/${this.id}`, { label: this.newLabel })
        .then(() => {
          this.fetchMenuData(); // Refresh menu data after renaming
        })
        .catch(error => {
          console.error('Error renaming menu item:', error);
        });
        
    },
    cancelRename() {
      this.renaming = false;
      // Optionally, reset the input to the original label
      this.newLabel = this.label;
    }
  },
};
</script>

<style scoped lang="scss">
.menu-item {
  position: relative;
  width: 100%;

  .label {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    white-space: nowrap;
    user-select: none;
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 14px;
    color: #6a6a6a;
    transition: all 0.3s ease;

    > div {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    i {
      font-size: 20px;
      color: #6e6e6e;
      transition: all 0.3s ease;

      &.expand {
        font-size: 16px;
        color: #cacaca;

        &.opened {
          transform: rotate(180deg);
        }
      }
    }

    &:hover {
      background: #deedff;
      cursor: pointer;
    }

    &.isSelected {
      background: #0674f3;
      font-weight: bold;
    }

    &.renaming {
      background: #f0f0f0;
    }
  }

  .items-container {
    width: 100%;
    left: calc(100% + 6px);
    transition: height 0.3s ease;
    overflow: hidden;

    &.small-menu {
      width: fit-content;
      position: absolute;
      background: #fff;
      box-shadow: 0 0 10px #ebebeb;
      top: 0;

      .label {
        width: 100% !important;
        padding-left: 20px !important;
      }
    }
  }
}
</style>
