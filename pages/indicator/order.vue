<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">Add Data</v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table   :headers="headers" :items="items" class="elevation-1">
            <template v-slot:item.id="{ item,index }">
                {{index+1}}
            </template>
            <template v-slot:item.code="{ item }">
                <div class="flex items-center p-2 ">
                    <img v-if="item.product_image" class=" -full h-10 w-10" :src="$url+item.product_image" alt="">
                    <img v-else class="rounded-full h-10 w-10" src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" alt="">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.product_name}} </span> <br>
                        <span class="text-gray-400 text-sm">{{item.code}}</span>
                        <span class="text-red-600 font-semibold" v-if="item.blacklist"><br>[X BlackList]</span>
                    </div>
                </div>
            </template>
            <template v-slot:item.user="{ item }">
                <div class="flex items-center p-2 ">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.user_full}} </span> <br>
                        <span class="text-gray-400 text-sm"> <span v-if="item.user_data.phone_number"> เบอร์ {{item.user_data.phone_number}}</span><br>
                            {{item.user_data.address}} {{(item.user_data.province)?`จ.${item.user_data.province}`:``}} {{(item.user_data.amphur)?`อ.${item.user_data.amphur}`:``}} {{(item.user_data.district)?`ต.${item.user_data.district}`:``}} {{item.user_data.zipcode}}</span>

                    </div>
                </div>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
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

                        <v-text-field v-model="form.code" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="code" hide-details></v-text-field>
                        <v-text-field v-model="form.created_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="created_at" hide-details></v-text-field>
                        <v-text-field v-model="form.updated_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="updated_at" hide-details></v-text-field>
                        <v-text-field v-model="form.product_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="product_id" hide-details></v-text-field>
                        <v-text-field v-model="form.user_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_id" hide-details></v-text-field>

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
            }, {
                text: "code",
                value: "code"
            }, {
                text: "user_id",
                value: "user"
            }, {
                text: "created_at",
                value: "created_at"
            }, {
                text: "updated_at",
                value: "updated_at"
            }, {
                text: "Action",
                value: "actions"
            }],
            page: 1,
            maxPage: 11,
            search: "",
            form: {},
            dialog: false,

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/indicator/order/?page=${this.page}&search=${this.search}`);

            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/adminindicator/order/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.indicator_order_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/adminindicator/order/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/adminindicator/order/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminindicator/order/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminindicator/order/${id}/`)
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
