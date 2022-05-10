<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> <v-icon class="mr-2">em em-loudspeaker</v-icon> Promotion </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">เพิ่มชื่อโปรโมชั่น</v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
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
                    <v-icon>em em-loudspeaker</v-icon>{{(form.id)?"แก้ไข":"สร้าง"}}Promotion
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">
                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="mdi-ticket-percent" outlined label="ชื่อส่วนลด" hide-details></v-text-field>
                        <v-text-field v-model="form.code" class="mt-4" prepend-inner-icon="mdi-barcode-scan" outlined label="โค้ดส่วนลด" hide-details></v-text-field>
                        <v-text-field v-model="form.discount" class="mt-4" prepend-inner-icon="mdi-ticket-percent" outlined label="ส่วนลด" hide-details></v-text-field>

                        <v-checkbox v-model="form.is_active" label="เปิดการใช้งาน"></v-checkbox>
                        <v-text-field v-model="form.is_point" class="mt-4" prepend-inner-icon="em em-copyright" outlined label="พ้อย" hide-details></v-text-field>
                        

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
                text: "ลำดับ",
                value: "id"
            },{
                text: "โค้ดส่วนลด",
                value: "code"
            },  {
                text: "ส่วนลด",
                value: "discount"
            },  {
                text: "สถานะ",
                value: "is_active"
            }, {
                text: "พ้อย",
                value: "is_point"
            },
            //  {
            //     text: "link_to",
            //     value: "link_to"
            // }, 
            {
                text: "ชื่อโปรโมชั่น",
                value: "name"
            },
            {
                text: "วันที่สร้าง",
                value: "created_at"
            }, {
                text: "วันที่อัพเดท",
                value: "updated_at"
            }, {
                text: "การจัดการ",
                value: "actions"
            }],
            page: 1,
            maxPage: 3,
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
            this.items = await Core.getHttp(`/api/webconfig/promotion/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/webconfig/promotion/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.webconfig_promotion_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/webconfig/promotion/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/webconfig/promotion/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/webconfig/promotion/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/webconfig/promotion/${id}/`)
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
