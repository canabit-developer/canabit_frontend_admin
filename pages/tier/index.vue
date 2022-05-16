<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-icon class="mr-4">em em-credit_card</v-icon> Tier
            </h2>

            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">
                <v-icon>em em-busts_in_silhouette</v-icon>เพิ่มเทียร์
            </v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
            <template v-slot:item.color="{ item }">
                <div>
                    <v-btn small :color="item.color">{{item.color}}</v-btn>
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

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon>em em-credit_card</v-icon> {{(form.id)?"แก้ไข":"เพิ่ม"}} Tier
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">

                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="em em-sports_medal" outlined label="ระบบเทียร์" hide-details></v-text-field>
                        <v-text-field type="number" v-model="form.length" class="mt-4" prepend-inner-icon="em em-registered" outlined label="พ้อย" hide-details></v-text-field>
                        <br> <br>
                        <center>
                            <v-color-picker v-model="form.color" dot-size="25" swatches-max-height="200"></v-color-picker>
                        </center> <br>
                        <v-text-field v-model="form.color" class="mt-4" prepend-inner-icon="em em-lower_left_paintbrush" outlined label="สี" hide-details></v-text-field>

                        <br>

                        <div class="mt-4 flex">
                            <v-spacer />
                            <v-btn type="submit" color="success">บันทึกข้อมูล</v-btn>
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
                text: "ระดับเทียร์",
                value: "name"
            }, {
                text: "พ้อย",
                value: "length"
            }, {
                text: "วันที่สร้าง",
                value: "created_at"
            }, {
                text: "วันที่อัพเดท",
                value: "updated_at"
            }, {
                text: "สี",
                value: "color"
            }, {
                text: "การจัดการ",
                value: "actions"
            }],
            page: 1,
            maxPage: 3,
            search: "",
            form: {
                color: '#FF0000'
            },
            dialog: false,

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/account/tier/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/account/tier/`, this.form)
            if (data.id) {
                // await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.account_tiermember_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/account/tier/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/account/tier/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/account/tier/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.form.color = '#FF0000'
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/account/tier/${id}/`)
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
