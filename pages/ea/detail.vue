<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-icon class="mr-2">em em-chart_with_upwards_trend</v-icon> Request Test
            </h2>

            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">
                <v-icon class="mr-2 "> em em-file_folder</v-icon> เพิ่ม Request Test
            </v-btn>
        </v-toolbar>

        <v-text-field dense @change="startup()" v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <div class="flex">
                    <v-btn  :disabled="item.link != ''"  x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn :disabled="item.link != ''"  x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </template>
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

            <template v-slot:item.user_full="{ item }">
                <div class="flex items-center p-2 ">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.user_full}} </span> <br>
                        <span class="text-gray-400 text-sm"> <span v-if="item.user_data.phone_number"> เบอร์ {{item.user_data.phone_number}}</span><br>
                            {{item.user_data.address}} {{(item.user_data.province)?`จ.${item.user_data.province}`:``}} {{(item.user_data.amphur)?`อ.${item.user_data.amphur}`:``}} {{(item.user_data.district)?`ต.${item.user_data.district}`:``}} {{item.user_data.zipcode}}</span>

                    </div>
                </div>
            </template>

            <template v-slot:item.status="{ item }">
                <div>
                    <Core-Status :status="item.status" />
                </div>
            </template>
        </v-data-table>
        <!-- <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination> -->

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2">em em-chart_with_upwards_trend</v-icon>
                    {{(form.id)?"แก้ไข":"เพิ่ม"}} Request Test
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">

                        <v-text-field v-model="form.code" class="mt-4" prepend-inner-icon="em em-1234" outlined label="รหัสสินค้า" hide-details></v-text-field>
                        <v-text-field v-model="form.link" class="mt-4" prepend-inner-icon="em em-link" outlined label="ที่อยู่ url" hide-details></v-text-field>

                        <div class="mt-4 flex">
                            <v-spacer />
                            <v-btn type="submit" color="success">
                                <v-icon class="mr-2">em em-floppy_disk</v-icon> บันทึกข้อมูล
                            </v-btn>
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
import {
    Web
} from "@/vuexes/web";
export default {
    data: () => {
        return {
            options: {
                locale: "en-US",
                length: 1000,
                precision: 0
            },
            xx: 55555,
            items: [],
            headers: [{
                text: "ลำดับ",
                value: "id"
            }, {
                text: "รหัสสินค้า",
                value: "code"
            }, {
                text: "ชื่อผู้ใช้",
                value: "user_full"
            }, {
                text: "URL",
                value: "link"
            }, {
                text: "วันที่สร้าง",
                value: "created_at"
            }, {
                text: "วันที่อัพเดทล่าสุด",
                value: "updated_at"
            }, {
                text: "การจัดการ",
                value: "actions"
            }],
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
            await Web.switchLoad(true)
            this.items = await Core.getHttp(`/api/adminea/requesttest/?page=${this.page}&search=${this.search}`);
            await Web.switchLoad(false)
        },
        async store() {

        },
        async update() {
            let data = await Core.putHttpAlert(`/api/adminea/requesttest/${this.form.id}/`, this.form)
            await Core.sentEmail(`สถานะการ Request Test EA :${this.form.product_name}`, this.form.user_data.email, `
                        <h3>สถานะ : สำเร็จ </h3>
                         <a href="${this.form.link}">Link ทดสอบ </a>
                        `)
            this.dialog = false
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminea/requesttest/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminea/requesttest/${id}/`)
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
