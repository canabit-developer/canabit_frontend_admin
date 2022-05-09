<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative " v-if="response">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-icon class="mr-4">em em-chart</v-icon> EA Products
            </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">
                <v-icon class="mr-2 "> em em-file_folder</v-icon> เพิ่มสินค้า EA
            </v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <div class="flex">
                    <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </template>
            <template v-slot:item.image="{ item }">
                <div class="p-4"><img :src="$url+item.image" class="w-20 h-auto shadow-xl" /></div>
            </template>
            <template v-slot:item.is_active="{ item }">
                <UI-IsActive :active="item.is_active"></UI-IsActive>

            </template>
        </v-data-table>
        <v-pagination v-model="page" :length="maxPage"></v-pagination>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-4">em em-chart</v-icon>
                    {{(form.id)?"แก้ไข":"เพิ่ม"}} สินค้า EA
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">
                        <div v-if="form.id">
                            <img :src="form.image" alt="">
                            <v-checkbox v-model="form.is_active" label="Active"></v-checkbox>
                        </div>
                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="em em-basket" outlined label="ชื่อสินค้า EA" hide-details></v-text-field>
                        <v-text-field v-model="form.sub_title" class="mt-4" prepend-inner-icon="em em-page_facing_up" outlined label="รายละเอียด" hide-details></v-text-field>
                        <br><br>
                        <v-icon class="mr-2">em em-camera </v-icon><span>รูปสินค้า EA : </span><input ref="ea_image" type="file"><br><br>
                        <v-text-field type="number" v-model="form.price" class="mt-4" prepend-inner-icon="em em-dollar" outlined label="ราคา" hide-details></v-text-field>
                        <v-select multiple v-model="form.broker" :items="brokers" item-text="name" item-value="id" class="mt-4" prepend-inner-icon="em em-bank" outlined label="Broker" hide-details></v-select>
                        <br>
                        <Core-Editor v-model="form.detail"></Core-Editor>
                        <!-- <pre>{{form}}</pre> -->
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
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                text: "ลำดับ",
                value: "id"
            }, {
                text: "ชื่อสินค้า EA",
                value: "name"
            }, {
                text: "รายละเอียด",
                value: "sub_title"
            }, {
                text: "รูปสินค้า EA",
                value: "image"
            }, {
                text: "ราคา",
                value: "price"
            }, {
                text: "สถานะ",
                value: "is_active"
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
            brokers: [],
            response: false

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.brokers = await Core.getHttp(`/api/finance/broker/?is_active=true`)
            this.items = await Core.getHttp(`/api/adminea/product/?page=${this.page}&search=${this.search}`);
            this.maxPage = this.items.count / 3
            this.response = true
            await this.closeDialog();
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/adminea/product/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.ea_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append('image', image);
                let update = await Core.putImageHttp(`/api/adminea/product/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/adminea/product/${this.form.id}/`, this.form)
            await this.updateImage(data.id);
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminea/product/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminea/product/${id}/`)
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
