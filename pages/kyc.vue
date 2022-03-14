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
            headers:[{ text: "id" , value:"id"},{ text: "image_card" , value:"image_card"},{ text: "image_selfie" , value:"image_selfie"},{ text: "user_verified" , value:"user_verified"},{ text: "user_verified_image_card_error" , value:"user_verified_image_card_error"},{ text: "user_verified_image_selfie_error" , value:"user_verified_image_selfie_error"},{ text: "phone_number" , value:"phone_number"},{ text: "phone_verified" , value:"phone_verified"},{ text: "refferal_code" , value:"refferal_code"},{ text: "created_at" , value:"created_at"},{ text: "updated_at" , value:"updated_at"},{ text: "user_id" , value:"user_id"},{ text: "user_verified_id_error" , value:"user_verified_id_error"},{ text: "user_verified_name_error" , value:"user_verified_name_error"},{ text: "card_id" , value:"card_id"},],
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
            this.items = await Core.getHttp(`/api/adminaccount/kyc/?page=${this.page}&search=${this.search}`);
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