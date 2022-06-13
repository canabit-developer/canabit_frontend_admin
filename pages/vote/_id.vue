<template>
<div v-if='response'>
    <v-toolbar color="transparent" flat dense>
        <v-btn icon fab outlined @click="$router.go(-1)" color="primary">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn> <span class="ml-4 text-xl font-semibold" v-if="storeA && storeB">{{storeA.name}} VS {{storeB.name}}</span>
        <v-spacer></v-spacer>
        <v-btn :disabled="data.is_ending" @click="finishVote()" color="success">ปิดการ Vote และประกาศผล</v-btn>
    </v-toolbar>
    <div>
        <div class="flex flex-col md:flex-row p-4">
            <div class="p-4 w-full md:w-5/12">
                <center>
                    <img class="h-96" :src="$url+storeA.image" alt="">
                    <h2 class="text-xl font-semibold">{{storeA.name}}</h2>
                    <h2 :class="(listsA.length > listsB.length)?'text-green-500':'text-red-500'" class="text-5xl font-semibold mt-2">{{listsA.length}} <span class="text-2xl">of vote</span> </h2>
                </center>
            </div>
            <div class="w-full md:w-2/12">
                <div class="h-full flex flex-col justify-center items-center">
                    <h2 class="text-5xl font-semibold "> VS </h2>
                    <h2 class="text-xl "> Use <span class="text-green-600 font-semibold ">{{data.point_use}} </span> of Point </h2>
                    <h2 class="text-sm "> TimeOut <span class="text-orange-400  ">{{data.times}} </span> </h2><br>
                    <h2 v-if="data.is_ending" class="text-red-600 text-4xl font-semibold">Vote สิ้นสุดแล้ว</h2>

                </div>
            </div>
            <div class="p-4 w-full md:w-5/12">
                <center>
                    <img class="h-96" :src="$url+storeB.image">
                    <h2 class="text-xl font-semibold">{{storeB.name}}</h2>
                    <h2 :class="(listsB.length > listsA.length)?'text-green-500':'text-red-500'" class="text-5xl font-semibold mt-2">{{listsB.length}} <span class="text-2xl">of vote</span> </h2>
                </center>
            </div>
        </div> 
    </div>
</div>
</template>

<script>
import {
    Core
} from '@/vuexes/core'
import {
    Web
} from '@/vuexes/web'
import {
    Auth
} from '@/vuexes/auth'
import _ from 'lodash'
export default {
    data() {
        return ({
            data: {},
            storeA: null,
            storeB: null,
            response: false,
            listsA: [],
            listsB: []
        })
    },
    async created() {
        await this.startup();
        this.response = true;
    },
    methods: {
        async startup() {
            this.data = await Core.getHttp(`/api/vote/votemode/${this.$route.params.id}/`)
            if (this.data) {
                this.storeA = this.data.store_a
                this.storeB = this.data.store_b
                await this.loadUser()
            }
        },
        async loadUser() {
            let list = await Core.getHttp(`/api/vote/voteuse/?user=&votemode=${this.$route.params.id}`)
            this.listsA = _.filter(list, {
                "choicereward": "A"
            })
            this.listsB = _.filter(list, {
                "choicereward": "B"
            })
        },
        async finishVote() {
            let result = (this.listsA.length > this.listsB.length) ? "A" : "B"
            let user = Auth.user
            let store = await Core.postHttp(`/api/adminvote/voteresult/`, {
                "result": result,
                "votemode": this.$route.params.id,
                "user": user.id,
                "created_at":this.data.times,
                "updated_at":this.data.times,
            }) 
            if(store.id){
                await Web.alert('ประกาศผลสำเร็จ')
                await this.updateStatus();
            }
        },
        async updateStatus(){
            let data = await Core.putHttp(`/api/vote/votemode/${this.$route.params.id}/`,{
                'is_ending':true
            })
            if(data.id){
                   await Web.alert('ปิดการ Vote แล้ว')
                   await this.startup();
            }
        }
    },
    computed: {

    }
}
</script>

<style>

</style>
