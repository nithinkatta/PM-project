<template>
  <div class="main">
     <div v-if="type === 'file'">
        <FileView :auth="auth"/>
     </div>
     <div v-if="type === 'folder'">
       <TextWidget :auth="auth"/>
     </div>
  </div>
</template>

<script>
import { useStore } from '../store';
import FileView from './FileView.vue';
import TextWidget from './TextWidget.vue';

export default {
  components: {
    TextWidget,
    FileView
  },
  data() {
    return {
      type: ''
    };
  },
  props:{
    auth: String
  },
  computed: {
    message() {
      const store = useStore();
      return store.getData;
    }
  },
  watch: {
    message() {
      const store = useStore();
      this.type = store.getType;
    }
  },
  created() {
    const store = useStore();
    this.type = store.getType;
  }
};
</script>

<style>
.main {
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
}
</style>
