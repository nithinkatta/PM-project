<template>
    <div >
       <TextWidget auth="admin"/>
    </div>
</template>

<script>
import { useStore } from '../store';
import TextWidget from '../components/TextWidget.vue';
export default {
    components: {
        TextWidget
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

</style>