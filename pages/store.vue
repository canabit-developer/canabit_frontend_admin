<template>
    <div> 
        <v-text-field @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1"></v-data-table>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>
    </div>
</template>

 
<script>
import {
    Core
} from "@/vuexes/core";
export default {
    data: () => {
        return {
            items: [],
            headers:[{ text: "id" , value:"id"},{ text: "name" , value:"name"},{ text: "image" , value:"image"},{ text: "detail" , value:"detail"},{ text: "point_use" , value:"point_use"},{ text: "is_active" , value:"is_active"},{ text: "created_at" , value:"created_at"},{ text: "updated_at" , value:"updated_at"},],
            page:1,
            maxPage:3,
            search: "",

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/adminstore/product/?page=${this.page}&search=${this.search}`);
        },
    },
    watch: {
        async page(newVal, oldVal) {
            await this.startup();
        }
    },
};
</script>
 
<style>
</style>