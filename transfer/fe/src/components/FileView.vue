<template>
  <div >


    <div class="header-container">
      <h1 class="header-title">
        {{name}}
        <span class="header-usercount"><strong>Usercount: 50</strong> {{kernelversion}}</span>
        <span class="header-milestone">Milestone: <i>{{milestone}}</i></span>
      </h1>
    </div>
    <!-- <div class="sidebar">
      <MenuBar/>
    </div> -->
    <div class="project-page">
      <div class="main-section">
      <div class="nav-section">
        <nav class="navbar">
          <ul>
            <li :class="{ active: activeTab === 'VersionDetails' }" @click="activeTab = 'VersionDetails'">Version Details</li>
            <li :class="{ active: activeTab === 'Basic' }" @click="activeTab = 'Basic'">Basic</li>
            <li :class="{ active: activeTab === 'Specifications' }" @click="activeTab = 'Specifications'">Specifications</li>
            <li :class="{ active: activeTab === 'Regions' }" @click="activeTab = 'Regions'">Regions</li>
            <li :class="{ active: activeTab === 'Operators' }" @click="activeTab = 'Operators'">Operators</li>
            <li :class="{ active: activeTab === 'VersionQuality' }" @click="activeTab = 'VersionQuality'">Version Quality</li>
          </ul>
        </nav>
      </div>
      <div class="content-section">
        <div class="main-content">
          <div v-if="activeTab === 'Basic'">
            <h3>Basic Information</h3>
            <LanderPage :id="id" tab="Basic" :projectDetails="basicDetails" auth="admin" />
          </div>
          <div v-if="activeTab === 'Specifications'">
            <h3>Specifications</h3>
            <LanderPage :id="id" tab="Specifications" auth="admin" />
          </div>
          <div v-if="activeTab === 'Regions'">
            <h3>Regions</h3>
            <LanderPage :id="id" tab="Regions" auth="admin"/>
          </div>
          <div v-if="activeTab === 'Operators'">
            <h3>Operators</h3>
            <LanderPage :id="id" tab="Operators" auth="admin"/>
          </div>
          <div v-if="activeTab === 'VersionQuality'">
            <h3>Version Quality</h3>
            <LanderPage :id="id" tab="VersionQuality" auth="admin"/>
          </div>
          <div v-if="activeTab === 'VersionDetails'">
            <VersionBlockVue :project="this.name" auth="admin" :id="id" />
          </div>
        </div>
        <StatusSliderVue :id="id" auth="admin"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LanderPage from '@/components/LauncherView.vue'; 
import StatusSliderVue from '../components/StatusSlider.vue';
import VersionBlockVue from '../components/VersionBlock.vue';
// import MenuBar from './MenuBar.vue';
export default {
  name: 'FileView',
  components: { LanderPage, StatusSliderVue,VersionBlockVue },
  data() {
    return {
      id: '',
      name: '',
      usercount: '25',
      kernelversion: '',
      activeTab: 'VersionDetails',
      basicDetails: []
    };
  },
  created() {
    const routeParams = this.$route.params;
    const routeQuery = this.$route.query;

    this.id = routeParams.id;
    this.name = routeQuery.name;
    this.usercount = routeQuery.usercount;
    this.kernelversion = routeQuery.kernelversion;

    this.basicDetails = [
      // { label: 'ID', text: this.id },
      { label: 'Name', text: this.name },
      { label: 'User Count', text: this.usercount },
      { label: 'Kernel Version', text: this.kernelversion }
    ];
  }
};
</script>

<style scoped>


.header-container {
  width: 80%;
  padding: 20px; 
  display: flex;
  justify-content: space-between; 
  align-items: center; 
}

.header-title {
  font-size: 30px;
  font-weight: bold;
  margin: 0;
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  width: 100%; 
}

.header-usercount,
.header-milestone {
  margin-left: 20px;
  font-size: 24px; 
}

.header-milestone i {
  font-style: italic; 
}





.project-page {
  display: flex;
  padding: 20px;
  /* min-width: 100vw; */
  width: 80vw;
  height: 90vh;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-section {
  flex: 8;
  display: flex;
  flex-direction: column;
}

.nav-section {
  flex: 0.5;
  box-shadow: 1px solid black;
  background-color: rgb(23, 114, 167);
}

.content-section {
  flex: 9.5;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.navbar {
  color: white;
  padding: 10px 20px;
}

.navbar ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.navbar li {
  margin-right: 20px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
}

.navbar li.active {
  background-color: #1bbcec;
}

.main-content {
  padding: 20px;
  flex-grow: 1;
}

.detail-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
