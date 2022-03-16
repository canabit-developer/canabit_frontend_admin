<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> <v-icon class="mr-2" >em em-chart_with_upwards_trend</v-icon> Request Test </h2>

            <v-spacer></v-spacer>
            <v-btn @click="openDialog()"> <v-icon class="mr-2 " > em em-file_folder</v-icon> เพิ่ม Request Test</v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn @click="openDialogUpdate(item.id)">Update Data</v-btn>
            </template>

        </v-data-table>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    {{(form.id)?"แก้ไข":"เพิ่ม"}} Request Test
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">

                        <v-text-field v-model="form.code" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="code" hide-details></v-text-field>
                        <v-text-field v-model="form.link" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="link" hide-details></v-text-field>
                        <v-text-field v-model="form.created_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="created_at" hide-details></v-text-field>
                        <v-text-field v-model="form.updated_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="updated_at" hide-details></v-text-field>
                        <v-text-field v-model="form.product_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="product_id" hide-details></v-text-field>
                        <v-text-field v-model="form.user_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_id" hide-details></v-text-field>

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
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                text: "ลำดับ",
                value: "id"
            }, {
                text: "ชื่อ Request Test ",
                value: "code"
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
                text: "product_id",
                value: "product_id"
            }, {
                text: "user_id",
                value: "user_id"
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
            this.items = await Core.getHttp(`/api/adminea/requesttest/?page=${this.page}&search=${this.search}`);
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
