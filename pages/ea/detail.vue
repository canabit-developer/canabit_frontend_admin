<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> <v-icon class="mr-2" >em em-chart_with_upwards_trend</v-icon> Request Test </h2>

            <v-spacer></v-spacer>
            <v-btn @click="openDialog()"> <v-icon class="mr-2 " > em em-file_folder</v-icon> เพิ่ม Request Test</v-btn>
        </v-toolbar>
        {{$comma(xx)}}
          <Core-Comma
          outlined
          dense
          label="sdsd"
      v-model="xx" 
    
    />
        <v-text-field dense @change="startup()" v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <div class="flex">
                    <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </div>
            </template>
            <template v-slot:item.product_image="{ item }">
                <div class="flex">
                     <img class="w-20 h-auto shadow-xl" :src="$url+item.product_image" alt="">
                </div>
            </template>
        </v-data-table>
        <!-- <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination> -->

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2" >em em-chart_with_upwards_trend</v-icon>
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
                            <v-btn type="submit" color="success"> <v-icon class="mr-2" >em em-floppy_disk</v-icon> บันทึกข้อมูล</v-btn>
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
            xx:55555,
            items: [],
            headers: [{
                text: "ลำดับ",
                value: "id"
            }, {
                text: "รหัสสินค้า",
                value: "code"
            }, {
                text: "ชื่อสินค้า",
                value: "product_name"
            }, {
                text: "รูปสินค้า",
                value: "product_image"
            }, {
                text: "ชื่อผู้ใช้",
                value: "user_full"
            }, {
                text: "ที่อยู่ url",
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
            await this.startup();
        },
        async delete(id) {
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
