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
            headers:[{ text: "id" , value:"id"},{ text: "received_from" , value:"received_from"},{ text: "point" , value:"point"},{ text: "created_at" , value:"created_at"},{ text: "updated_at" , value:"updated_at"},{ text: "user_id" , value:"user_id"},{ text: "remark" , value:"remark"},{ text: "status" , value:"status"},{ text: "type" , value:"type"},],
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
            this.items = await Core.getHttp(`/api/adminaccount/userpointhistory/?page=${this.page}&search=${this.search}`);
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