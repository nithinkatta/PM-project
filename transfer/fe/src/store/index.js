import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    id: '',
    data: 'Home',
    type: 'folder' ,
    auth: 'admin'
  }),
  actions: {
    updateData(payload) {
      this.data = payload;
    },
    updateType(payload) {
      this.type = payload;
    },
    updateID(payload) {
      this.id = payload;
    },
    setAuth(payload) {
      this.auth = payload;
    }
  },
  getters: {
    getData: (state) => state.data,
    getType: (state) => state.type,
    getID: (state) => state.id,
    getAuth: (state) => state.auth
  }
});
