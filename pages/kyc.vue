<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">KYC </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">Add Data</v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn @click="openDialogUpdate(item.id)">Update Data</v-btn>
            </template>
            <template v-slot:item.image_card="{ item }">
                <div class="p-4"><img :src="item.image_card" class="w-20 h-auto shadow-xl" /></div>
            </template>
            <template v-slot:item.image_selfie="{ item }">
                <div class="p-4"><img :src="item.image_selfie" class="w-20 h-auto shadow-xl" /></div>
            </template>
               <template v-slot:item.image_selfie="{ item }">
                <div class="p-4"><img :src="item.image_selfie" class="w-20 h-auto shadow-xl" /></div>
            </template>

            <template v-slot:item.activated="{ item }">
                <div>
                     <UI-IsCheck text="ภาพถ่ายสำเนาบัตรประจำตัวประชาชน มีปัญหา" :active="item.user_verified"></UI-IsCheck>
                     <UI-IsCheck text="ภาพถ่าย selfie กับบัตรประจำตัวประชาชน มีปัญหา" :active="item.user_verified"></UI-IsCheck>
                     <UI-IsCheck text="ชื่อ-สกุล ไม่ตรงกับบัตรประจำตัวประชาชน" :active="item.user_verified"></UI-IsCheck>
                     <UI-IsCheck text="เลขบัตรประชาชน ไม่ตรงกับบัตรประจำตัวประชาชน" :active="item.user_verified"></UI-IsCheck>  
                </div>
            </template>

             <template v-slot:item.user_verified="{ item }">
                <div>
                    <UI-IsActive :active="item.user_verified"></UI-IsActive>
                </div>
            </template>

        </v-data-table>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    {{(form.id)?"Update":"Create"}} Data
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">

                        <v-text-field v-model="form.image_card" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="image_card" hide-details></v-text-field>
                        <v-text-field v-model="form.image_selfie" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="image_selfie" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_image_card_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_image_card_error" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_image_selfie_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_image_selfie_error" hide-details></v-text-field>
                        <v-text-field v-model="form.phone_number" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="phone_number" hide-details></v-text-field>
                        <v-text-field v-model="form.phone_verified" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="phone_verified" hide-details></v-text-field>
                        <v-text-field v-model="form.refferal_code" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="refferal_code" hide-details></v-text-field>
                        <v-text-field v-model="form.created_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="created_at" hide-details></v-text-field>
                        <v-text-field v-model="form.updated_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="updated_at" hide-details></v-text-field>
                        <v-text-field v-model="form.user_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_id" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_id_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_id_error" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_name_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_name_error" hide-details></v-text-field>
                        <v-text-field v-model="form.card_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="card_id" hide-details></v-text-field>

                        <div class="mt-4 flex">
                            <v-spacer />
                            <v-btn type="submit" color="success">Submit</v-btn>
                        </div>
                    </form>
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>
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
            headers: [{
                    text: "id",
                    value: "id"
                },
                {
                    text: "user_full",
                    value: "user_full"
                },
                {
                    text: "card_id",
                    value: "card_id"
                }, 
                {
                    text: "image_card",
                    value: "image_card"
                }, {
                    text: "image_selfie",
                    value: "image_selfie"
                },
                {
                    text: "phone_number",
                    value: "phone_number"
                },
               
                {
                    text: "user_verified",
                    value: "user_verified"
                },
                 {
                    text: "Remark",
                    value: "activated"
                },
                //   {   text: "user_verified_image_card_error",
                //     value: "user_verified_image_card_error"
                // }, {
                //     text: "user_verified_image_selfie_error",
                //     value: "user_verified_image_selfie_error"
                // }, {
                //     text: "phone_verified",
                //     value: "phone_verified"
                // }, {
                //     text: "refferal_code",
                //     value: "refferal_code"
                // }, {
                //     text: "created_at",
                //     value: "created_at"
                // }, {
                //     text: "updated_at",
                //     value: "updated_at"
                // }, {
                //     text: "user_verified_id_error",
                //     value: "user_verified_id_error"
                // }, {
                //     text: "user_verified_name_error",
                //     value: "user_verified_name_error"
                // },  
                {
                    text: "Action",
                    value: "actions"
                }
            ],
            page: 1,
            maxPage: 3,
            search: "",
            form: {},
            dialog: false,

        };
    },
    async created() {
        await this.startup();
        await this.geData();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/adminaccount/kyc/?page=${this.page}&search=${this.search}`);
        },
        async store() {

        },
        async update() {
            delete this.form.image_card
            delete this.form.image_selfie
            let data = await Core.putHttpAlert(`/api/adminaccount/kyc/${this.form.id}/`, this.form)
            await this.startup();
        },
        async delete(id) {
            let data = await Core.deleteHttpAlert(`/api/adminaccount/kyc/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminaccount/kyc/${id}/`)
            this.dialog = true;
        },
        async closeDialog() {
            this.form = {};
            this.dialog = false;
        },

        async geData(){
            let data = await Core.getHttp(`https://www.myfxbook.com/private/charts.json?invitation=&showLots=false&showPips=true&showChange=false&showSymbolPips=false&showMain=true&magicNumbers=&symbols=&tags=&days=1,5,2,6,3,7,4&hours=0,4,8,12,16,20,1,5,9,13,17,21,2,6,10,18,22,14,3,7,11,15,19,23&buySell=0,1,6,16&yieldStart=&yieldEnd=&netProfitStart=&netProfitEnd=&selectedTime=1&pipsStart=&pipsEnd=&l=s&accountOid=6214185&startDate=2022-01-01&endDate=2022-12-31&chartType=3&monthType=0&oid=6214185&rand=0.15501768751485212`)
            console.log(data);
        }
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
