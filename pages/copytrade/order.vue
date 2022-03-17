api

table
 Create

<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"><v-icon class="mr-2" >em em-clipboard</v-icon> Order </h2>
            <v-spacer></v-spacer>
            <!-- <v-btn @click="openDialog()">Add Data</v-btn> -->
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
             <template v-slot:item.product_image="{ item }">
                <div class="p-4"><img :src="$url+item.product_image" class="w-20 h-auto shadow-xl" /></div>
            </template>

        </v-data-table>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2" >em em-clipboard</v-icon>
                    {{(form.id)?"แก้ไข":"เพิ่ม"}} Order
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()"> 
                        <v-text-field v-model="form.code" class="mt-4" prepend-inner-icon="em em-1234" outlined label="รหัส" hide-details></v-text-field>
                        <v-text-field v-model="form.product_id" class="mt-4" prepend-inner-icon="em em-male-technologist" outlined label="ชื่อ Master" hide-details></v-text-field>
                        <v-text-field v-model="form.user_id" class="mt-4" prepend-inner-icon="em em-bust_in_silhouette" outlined label="ผู้ใช้" hide-details></v-text-field>

                        <div class="mt-4 flex">
                            <v-spacer />
                            <v-btn type="submit" color="success"><v-icon class="mr-2" >em em-floppy_disk</v-icon> บันทึกข้อมูล</v-btn>
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
                    text: "ลำดับ",
                    value: "id"
                }, {
                    text: "รหัส",
                    value: "code"
                },

                {
                    text: "ผู้ใช้",
                    value: "user_full"
                },
                {
                    text: "ชื่อ Master",
                    value: "product_name"
                },
                {
                    text: "รูป Master",
                    value: "product_image"
                },
                {
                    text: "วันที่สร้าง",
                    value: "created_at"
                }, {
                    text: "วันที่อัพเดทล่าสุด",
                    value: "updated_at"
                }, {
                    text: "การจัดการ",
                    value: "actions"
                }
            ],
            page: 1,
            maxPage: 10,
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
            this.items = await Core.getHttp(`/api/admincopytrade/order/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/admincopytrade/order/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.copytrade_order_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/admincopytrade/order/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/admincopytrade/order/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/admincopytrade/order/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/admincopytrade/order/${id}/`)
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
