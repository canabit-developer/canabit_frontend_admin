<template>
<div> 
    <v-snackbar :color="snackColor" v-model="snacking" :vertical="true">
        {{ snackTxt }}

        <template v-slot:action="{ attrs }">
            <v-btn  text v-bind="attrs" @click="offSnack()">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</div>
</template>

<script>
import {Web} from '~/vuexes/web'
export default {

    computed:{
        snacking(){
            return Web.snacking
        },
        snackTxt(){
            return Web.snackTxt
        },
        snackColor(){
            return Web.snackColor
        }
    },
    methods:{
        async offSnack(){
            await Web.offSnack()
        }
    }
}
</script>

<style>

</style>
