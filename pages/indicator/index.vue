<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"><v-icon class="mr-2" >em em-arrow_double_down</v-icon> Indicator</h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()"><v-icon class="mr-2 " > em em-file_folder</v-icon> เพิ่ม Indicator</v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
            <template v-slot:item.link="{ item }">
                <a target="_blank" :href="item.link">Link</a>
            </template>
            <template v-slot:item.image="{ item }">
                <div class="p-4"><img :src="$url+item.image" class="w-20 h-auto shadow-xl" /></div>
            </template>
            <template v-slot:item.is_active="{ item }">
                <UI-IsActive :active="item.is_active"></UI-IsActive>
            </template>
        </v-data-table>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2" >em em-arrow_double_down</v-icon>
                    {{(form.id)?"แก้ไข":"เพิ่ม"}} Indicator
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
                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="em em-arrows_clockwise" outlined label="ชื่อ Indicator " hide-details></v-text-field>
                        <br><br><v-icon class="mr-2" >em em-camera </v-icon><span>รูป Indicator : </span><input ref="indicator_image" type="file"><br><br>
                        <br>
                        <Core-Editor v-model="form.detail"></Core-Editor>
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
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                text: "ลำดับ",
                value: "id"
            }, {
                text: "ชื่อ Indicator",
                value: "name"
            }, {
                text: "รูป Indicator",
                value: "image"
            }, {
                text: "สถานะ",
                value: "is_active"
            }, {
                text: "วันนที่สร้าง",
                value: "created_at"
            }, {
                text: "วันที่อัพเดทล่าสุด",
                value: "updated_at"

            }, {
                text: "ที่อยู่ url",
                value: "link"
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
            this.items = await Core.getHttp(`/api/adminindicator/product/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/adminindicator/product/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.indicator_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append('image', image);
                let update = await Core.putImageHttp(`/api/adminindicator/product/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/adminindicator/product/${this.form.id}/`, this.form)
            await this.updateImage(data.id);
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminindicator/product/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminindicator/product/${id}/`)
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
