api

table
 Create

<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">Add Data</v-btn>
        </v-toolbar>
        <v-text-field dense @input="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>

        <v-data-table :headers="headers" :items="items" class="elevation-1">
           <template v-slot:item.store_a="{ item }">
                <div class="p-4 flex items-center"><img :src="$url+item.store_a.image" class="w-20 h-auto shadow-xl" /> {{item.store_a.name}}</div>
            </template>
           <template v-slot:item.store_b="{ item }">
                <div class="p-4 flex items-center"><img :src="$url+item.store_b.image" class="w-20 h-auto shadow-xl" /> {{item.store_b.name}}</div>
            </template>
          
            <template v-slot:item.actions="{ item }">
              <v-btn x-small fab class="m-2" @click="$router.push(`/vote/${item.id}/`)" color="warning">
                    <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <template v-slot:item.is_active="{ item }"> 
                <UI-IsChecks text="เปิดใช้งาน" :active="!item.is_active"></UI-IsChecks>
            </template>
            <template v-slot:item.is_ending="{ item }">
                <UI-IsChecks text="สิ้นสุดการ Vote" :active="!item.is_ending"></UI-IsChecks>
            </template>

        </v-data-table>
        <!-- <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination> -->

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
                        <v-autocomplete item-value="id" item-text="name" :items="products" v-model="form.store_a" class="mt-4" prepend-inner-icon="mdi-shopping" outlined label="store_a_id" hide-details>
                            <template v-slot:selection="{ item, index }">
                                <div class="flex items-center p-2">
                                    <img class="shadow-xl rounded-lg w-10 h-10 object-cover" :src="$url+item.image"> <span class="ml-2">{{ item.name }}</span>
                                </div>
                            </template>
                            <template v-slot:item="{ item }">
                                <div class="flex items-center p-2">
                                    <img class="shadow-xl rounded-lg w-10 h-10 object-cover" :src="$url+item.image"> <span class="ml-2">{{ item.name }}</span>
                                </div>
                            </template>
                        </v-autocomplete>
                        <v-autocomplete item-value="id" item-text="name" :items="products" v-model="form.store_b" class="mt-4" prepend-inner-icon="mdi-shopping" outlined label="store_a_id" hide-details>
                            <template v-slot:selection="{ item, index }">
                                <div class="flex items-center p-2">
                                    <img class="shadow-xl rounded-lg w-10 h-10 object-cover" :src="$url+item.image"> <span class="ml-2">{{ item.name }}</span>
                                </div>
                            </template>
                            <template v-slot:item="{ item }">
                                <div class="flex items-center p-2">
                                    <img class="shadow-xl rounded-lg w-10 h-10 object-cover" :src="$url+item.image"> <span class="ml-2">{{ item.name }}</span>
                                </div>
                            </template>
                        </v-autocomplete>
                        <v-text-field v-model="form.point_use" class="mt-4" prepend-inner-icon="mdi-cash" outlined label="point_use" hide-details></v-text-field>
                        <v-text-field type="date" v-model="form.times" class="mt-4" prepend-inner-icon="mdi-calendar" outlined label="times" hide-details></v-text-field>
                        <div class="" v-if="form.id">
                            <v-checkbox v-model="form.is_ending" label="สิ้นสุดการ Vote"></v-checkbox>
                            <v-checkbox v-model="form.is_active" label="เปิดการใช้งาน"></v-checkbox>
                        </div>
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
import _ from 'lodash'
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                text: "id",
                value: "id"
            }, {
                text: "store_a",
                value: "store_a"
            }, {
                text: "store_b",
                value: "store_b"
            }, {
                text: "point_use",
                value: "point_use"
            }, {
                text: "times",
                value: "times"
            }, {
                text: "created_at",
                value: "created_at"
            }, {
                text: "updated_at",
                value: "updated_at"
            }, {
                text: "is_active",
                value: "is_active"
            }, {
                text: "is_ending",
                value: "is_ending"
            }, {
                text: "Action",
                value: "actions"
            }],
            page: 1,
            maxPage: 3,
            search: "",
            form: {},
            products: [],
            dialog: false,

        };
    },
    async created() {
        await this.getProduct();
        await this.startup();

    },
    methods: {
        async getProduct() {
            this.products = await Core.getHttp(`/api/adminstore/products/`)
        },
        getProductById(id) {
            try {
                return _.find(this.products,{id:id})
            } catch (error) {
                return null
            }
        },
        async startup() {
            this.items = await Core.getHttp(`/api/adminvote/votemode/?page=${this.page}&search=${this.search}`);
            this.items =  _.map(this.items, (r)=>{
                let item = r
                item.store_a =   this.getProductById(item.store_a)
                item.store_b =   this.getProductById(item.store_b)
                return item
            })
            await this.closeDialog()
        }, 
        async store() {
            let data = await Core.postHttpAlert(`/api/adminvote/votemode/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            try {
                let image = this.$refs.vote_votemode_image.files[0]
                if (image) {
                    let formData = new FormData()
                    formData.append("image", image);
                    let update = await Core.putImageHttp(`/api/adminvote/votemode/${id}/`, formData)
                }
            } catch (error) {

            }

        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/adminvote/votemode/${this.form.id}/`, this.form)
            this.dialog = false
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminvote/votemode/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminvote/votemode/${id}/`)
            this.dialog = true;
        },
        async closeDialog() {
            this.form = {};
            this.dialog = false;
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
