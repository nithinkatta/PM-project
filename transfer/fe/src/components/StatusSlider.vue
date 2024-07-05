<template>
  <div class="status-slider">
    <div v-for="(stage, index) in stages" :key="index" class="stage">
      <div
        class="stage-circle"
        :class="stageClass(stage)"
        @click="canUpdate && toggleStage(index)"
        @contextmenu.prevent="canUpdate && showContextMenu($event, index)"
      >
        <span class="stage-text">{{ stageText(stage) }}</span>
      </div>
      <div class="stage-info">
        <a
          v-if="stage.url !== ''"
          :href="stage.url"
          class="stage-name"
          target="_blank"
        >{{ stage.status }}</a>
        <div v-else class="stage-name">
          {{ stage.status }}
        </div>
        <img
          v-if="canUpdate"
          src="https://w7.pngwing.com/pngs/457/165/png-transparent-computer-icons-hyperlink-link-miscellaneous-blue-text.png"
          alt="Bind URL"
          @click="promptUrl(index)"
          class="link-icon"
        />
      </div>
      <div v-if="index < stages.length - 1" class="stage-arrow"></div>
    </div>
    <div v-if="canUpdate && contextMenu.visible" class="context-menu" :style="contextMenu.style">
      <div @click="setStageState(contextMenu.index, 'completed')">Completed</div>
      <div @click="setStageState(contextMenu.index, 'ongoing')">Ongoing</div>
      <div @click="setStageState(contextMenu.index, 'delayed')">Delayed</div>
      <div @click="setStageState(contextMenu.index, 'not started')">Not Started</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['auth', 'id'],
  data() {
    return {
      stages: [
        { status: 'Pre-XTS', state: 'not started', url: '' },
        { status: 'Preparation', state: 'not started', url: '' },
        { status: 'Selfcheck', state: 'not started', url: '' },
        { status: 'Testing', state: 'not started', url: '' },
        { status: 'OTA-Released', state: 'not started', url: '' }
      ],
      contextMenu: {
        visible: false,
        style: {},
        index: null
      }
    };
  },
  computed: {
    canUpdate() {
      return this.auth === 'admin';
    }
  },
  methods: {
    fetchStatusBars() {
      console.log('ENTERED FETCH STATE');
      axios.get(`http://localhost:3000/status_bars/${this.id}`)
        .then(response => {
          console.log(response.data);
          if (response.data.length != 0) {
            console.log("Found some data regarding this");
            this.stages = [ { status: 'Pre-XTS', state:response.data.Pre_XTS.state, url: response.data.Pre_XTS.url }, 
                            { status: 'Preparation', state: response.data.Preparation.state, url: response.data.Preparation.url }, 
                            { status: 'Selfcheck', state: response.data.Selfcheck.state, url: response.data.Selfcheck.url }, 
                            { status: 'Testing', state: response.data.Testing.state, url:response.data.Testing.url }, 
                            { status: 'OTA-Released', state: response.data.OTA_Released.state, url: response.data.OTA_Released.url } 
                          ];
          } else {
            this.initializeStatusBars();
          }
        })
        .catch(error => {
          console.error('Error fetching status bars:', error);
        });
    },
    initializeStatusBars() {
      console.log("Initial Start");
      axios.get(`http://localhost:3000/status_bars/${this.id}`)
        .then(response => {
          if (response.data.length === 0) {
            // Data does not exist for this id, initialize status bars
            const initialStages = {
              Pre_XTS: { state: 'not started', url: '' },
              Preparation: { state: 'not started', url: '' },
              Selfcheck: { state: 'not started', url: '' },
              Testing: { state: 'not started', url: '' },
              OTA_Released: { state: 'not started', url: '' }
            };

            axios.post(`http://localhost:3000/status_bars/${this.id}`, initialStages)
              .then(response => {
                console.log('Status bars initialized:', response.data);
              })
              .catch(error => {
                console.error('Error initializing status bars:', error);
              });
          } else {
            // Data already exists, no need to initialize again
            console.log(response.data);
            console.log('Status bars already initialized for this id');
          }
        })
        .catch(error => {
          console.error('Error fetching status bars:', error);
        });
    },
    stageClass(stage) {
      if (stage.state === 'completed') return 'completed';
      if (stage.state === 'ongoing') return 'ongoing';
      if (stage.state === 'delayed') return 'delayed';
      if (stage.state === 'not started') return 'not-started';
      return '';
    },
    stageText(stage) {
      if (stage.state === 'completed') return 'Completed';
      if (stage.state === 'ongoing') return 'Ongoing';
      if (stage.state === 'delayed') return 'Delayed';
      return 'Not Started';
    },
    toggleStage(index) {
      const currentState = this.stages[index].state;
      let newState = '';

      if (currentState === 'completed') {
        newState = 'ongoing';
      } else if (currentState === 'ongoing') {
        newState = 'delayed';
      } else if (currentState === 'delayed') {
        newState = 'not started';
      } else {
        newState = 'completed';
      }

      this.stages[index].state = newState;
      this.updateStatusBars();
    },
    showContextMenu(event, index) {
      this.contextMenu.visible = true;
      this.contextMenu.style = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`
      };
      this.contextMenu.index = index;
    },
    setStageState(index, state) {
      this.stages[index].state = state;
      this.contextMenu.visible = false;
      this.updateStatusBars();
    },
    promptUrl(index) {
      if (!this.canUpdate) return;
      console.log("entered for routing");
      const url = prompt('Enter URL:');
      if (url) {
        this.stages[index].url = url;
        this.updateStatusBars();
      }
    },
    hideContextMenu() {
      this.contextMenu.visible = false;
    },
    updateStatusBars() {
      const stages = {
        Pre_XTS: this.stages[0],
        Preparation: this.stages[1],
        Selfcheck: this.stages[2],
        Testing: this.stages[3],
        OTA_Released: this.stages[4]
      };

      axios.put(`http://localhost:3000/status_bars/${this.id}`, { stages })
        .then(response => {
          console.log('Status bars updated:', response.data);
        })
        .catch(error => {
          console.error('Error updating status bars:', error);
        });
    }
  },
  mounted() {
    window.addEventListener('click', this.hideContextMenu);
    this.fetchStatusBars();
  },
  // beforeDestroy() {
  //   window.removeEventListener('click', this.hideContextMenu);
  // }
};
</script>

<style scoped>
.status-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}
.stage {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 20px; /* Add more spacing between stages */
}
.stage-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: orange;
  margin: 0 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.stage-circle.completed {
  background-color: green;
}
.stage-circle.ongoing {
  background-color: orange;
}
.stage-circle.delayed {
  background-color: red;
}
.stage-circle.not-started {
  background-color: blue;
  color: black;
}
.stage-text {
  color: white;
  font-weight: bold;
}
.stage-info {
  display: flex;
  align-items: center;
}
.stage-name {
  color: black; /* Default color */
  font-weight: bold; /* Bold text */
  margin-top: 5px;
  cursor: pointer;
  text-decoration: none; /* Remove underline */
}
.stage-name:hover {
  color: blue; /* Color on hover */
}

.link-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 5px;
}

.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
.context-menu > div {
  padding: 8px 12px;
  cursor: pointer;
}
.context-menu > div:hover {
  background: #f0f0f0;
}
</style>
