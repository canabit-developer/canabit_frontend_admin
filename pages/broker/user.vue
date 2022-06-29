<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">Add Data</v-btn>
        </v-toolbar>
        <v-text-field dense @input="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
         <template v-slot:item.broker_no="{ item }">
                <div class="flex items-center p-2 ">
                    <img v-if="item.broker_image" class=" -full h-10 w-10" :src="$url+item.broker_image" alt="">
                    <img v-else class="rounded-full h-10 w-10" src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" alt="">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.broker_name}} </span> <br>
                        <span class="text-gray-400 text-sm">{{item.broker_no}}</span> 
                    </div>
                </div>
            </template>
               <template v-slot:item.account_no="{ item }">
                <div class="flex items-center p-2 ">
                    <img v-if="item.account_image" class=" -full h-10 w-10" :src="$url+item.account_image" alt="">
                    <img v-else class="rounded-full h-10 w-10" src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" alt="">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.account_name}} </span> <br> 
                    </div>
                </div>
            </template>

          <template v-slot:item.user="{ item }">
                <div class="flex items-center p-2 ">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.user_full}} </span> <br> 
                          <span class="text-gray-400 font-semibold"> {{item.user_data.email}} </span> <br> 
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
            <template v-slot:item.status="{ item }">
                <div>
                    <Core-Status :status="item.status" />
                </div>
            </template>


        </v-data-table>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    {{(form.id)?"แก้ไข":"สร้าง"}}ข้อมูล
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">

                        <v-select outlined item-text="name" item-value="val" :items="[{val:0,name:'รออนุมัติ'},{val:1,name:'อนุมัติ'},{val:2,name:'ไม่อนุมัติ'}]" v-model="form.status" label="อัพเดทสถานะ"></v-select>
                        <v-textarea v-model="form.remark" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="หมายเหตุ" hide-details></v-textarea>
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
                text: "ID",
                value: "id"
            }, {
                text: "Broker",
                value: "broker_no"
            },  {
                text: "Account",
                value: "account_no"
            }, {
                text: "User",
                value: "user"
            }, {
                text: "Status",
                value: "status"
            }, {
                text: "Remark",
                value: "remark"
            }, {
                text: "Created",
                value: "created_at"
            }, {
                text: "Updated",
                value: "updated_at"
            }, {
                text: "Action",
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
            this.items = await Core.getHttp(`/api/adminfinanace/brokeraccount/?search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/finance/brokeraccount/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.finance_brokeraccount_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/finance/brokeraccount/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/finance/brokeraccount/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/finance/brokeraccount/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/finance/brokeraccount/${id}/`)
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
