<template>
<div v-if='response'>
    <pre>{{lists}}</pre>
</div>
</template>

 
<script>
import {
    Core
} from '@/vuexes/core'
import {
    Auth
} from '@/vuexes/auth'
export default {
    data() {
        return ({
            response: false,
            lists: []
        })
    },
    async created() {
        await this.startup();
        this.response = true;
    },
    methods: {
        async startup() {

        }
    },
    computed: {

    }
}
</script>

 
<style>

 </style>
