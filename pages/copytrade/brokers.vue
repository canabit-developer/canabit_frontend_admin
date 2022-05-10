<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-icon>em em-clipboard</v-icon> Brokers
            </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()"><v-icon class="mr-2 " > em em-file_folder</v-icon>เพิ่ม Broker</v-btn>
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
            <template v-slot:item.image="{ item }">
                <div class="p-4"><img :src="$url+item.image" class="w-20 h-auto shadow-xl" /></div>
            </template>
    <template v-slot:item.is_active="{ item }">
                <UI-IsActive :active="item.is_active"></UI-IsActive>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    {{(form.id)?"แก้ไข":"สร้าง"}}Broker
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">

                        <br><br><v-icon class="mr-2">em em-camera </v-icon><span>รูป Broker : </span><input ref="copytrade_brokerinproduct_image" type="file"><br><br>
                 
                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="em em-chart" outlined label="ชื่อ Broker" hide-details></v-text-field>
                               <v-text-field v-model="form.link" class="mt-4" prepend-inner-icon="em em-link" outlined label="ที่อยู่ url" hide-details></v-text-field>
                        <v-checkbox v-model="form.is_active" label="สถานะ"></v-checkbox>

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
                    text: "รูป Broker",
                    value: "image"
                }, {
                    text: "ชื่อ Broker",
                    value: "name"
                }, {
                    text: " ที่อยู่ url",
                    value: "link"
                },
                {
                    text: "วันที่สร้าง",
                    value: "created_at"
                },
                {
                    text: "วันที่อัพเดท",
                    value: "updated_at"
                },{
                    text: "สถานะ",
                    value: "is_active"
                },  {
                    text: "การจัดการ",
                    value: "actions"
                }
            ],
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
            this.items = await Core.getHttp(`/api/copytrade/brokerinproduct/?search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/copytrade/brokerinproduct/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.copytrade_brokerinproduct_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/copytrade/brokerinproduct/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/copytrade/brokerinproduct/${this.form.id}/`, this.form)
            if(data.id){
                  await this.updateImage(data.id)
            } 
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/copytrade/brokerinproduct/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/copytrade/brokerinproduct/${id}/`)
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
