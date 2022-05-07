<template>
<div   >
    <Test ref="testc" />
 {{text}}
    <v-btn @click="setDataPlus" color="success">text</v-btn>
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
            lists: [],
            text:''
        })
    },
 
    async mounted() {
         this.response = true;
        await this.startup();
       
    },
    methods: {
        async startup() {
          console.log( this.$refs.testc.text)
          this.$refs.testc.text = "555+"
            console.log( this.$refs.testc.text)

        this.text = this.$refs.testc.text
        
        },
        async setDataPlus(){
         await this.$refs.testc.setData(1)
        }
    },
    computed: {

    }
}
</script>

 
<style>

 </style>
