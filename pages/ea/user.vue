<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> </h2>
            <v-spacer></v-spacer>
            <!-- <v-btn @click="openDialog()">Add Data</v-btn> -->
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>

        <v-data-table hide-default-footer items-per-page="100" :headers="headers" :items="items.results" class="elevation-1">
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

            <template v-slot:item.user="{ item }">
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

            <template v-slot:item.use_point="{ item }">
                <div>
                    <span class="text-orange-600 font-semibold" v-if="item.use_point > 0">- {{item.use_point}}</span>
                    <span v-else>-</span>
                </div>
            </template>

            <template v-slot:item.use_promotion="{ item }">
                <div>
                    <span v-if="item.promotion_data"> <b class="text-orange-600">{{item.promotion_data.name}}</b><br>{{item.promotion_data.code}} </span>
                    <span>-</span>
                </div>
            </template>

            <template v-slot:item.actions="{ item }">
            <div class="flex " >
                    <v-btn :disabled="item.status != 0" x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn :disabled="item.status != 0" x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </div>
            </template>
        </v-data-table><br>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    {{(form.id)?"Update":"Create"}} Data
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">
                        <v-select outlined item-text="name" item-value="val" :items="[{val:0,name:'รออนุมัติ'},{val:1,name:'อนุมัติ'},{val:2,name:'ไม่อนุมัติ'}]" v-model="form.status" label="อัพเดทสถานะ"></v-select>
                        <v-textarea v-model="form.remark" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="remark" hide-details></v-textarea>
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
    Auth
} from "@/vuexes/auth";
import {
    Core
} from "@/vuexes/core";
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                    text: "id",
                    value: "id"
                }, {
                    text: "code",
                    value: "code"
                }, {
                    text: "user",
                    value: "user"
                }, {
                    text: "status",
                    value: "status"
                },
                {
                    text: "use_point",
                    value: "use_point"
                }, {
                    text: "use_promotion",
                    value: "use_promotion"
                },
                {
                    text: "remark",
                    value: "remark"
                },
                {
                    text: "created_at",
                    value: "created_at"
                }, {
                    text: "updated_at",
                    value: "updated_at"
                }, 
                {
                    text: "Action",
                    value: "actions"
                }
            ],
            page: 1,
            maxPage: 20,
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
            this.items = await Core.getHttp(`/api/adminea/order/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/adminea/order/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.ea_order_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/adminea/order/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/adminea/order/${this.form.id}/`, this.form)
            if (data.id) {
                let statusTxt = ''
                if (this.form.status == 1) {
                    statusTxt = 'สำเร็จ'
                } else if (this.form.status == 2) {
                    statusTxt = 'ถูกยกเลิก'
                }
                if (this.form.status == 2) {
                    // alert(this.form.user)
                    await Auth.addPoint(this.form.user, this.form.use_point);
                    await Auth.logPoint(this.form.user, "คืน Point เนื่องจากสถานะการซื้อถูกยกเลิก", this.form.use_point, 0, 1)

                }
                if (this.form.status == 1 || this.form.status == 2) {
                    await Core.sentEmail(`สถานะการสั่งซื้อ EA :${this.form.product_name}`, this.form.user_data.email, `
                        <h3>สถานะการสั่งซื้อ EA :${this.form.product_name} : ${statusTxt} </h3>
                        <h4>เหตุผล : ${(this.form.remark)?this.form.remark:'-'} </h4>
                        `)
                }

                this.dialog = false

            }
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminea/order/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminea/order/${id}/`)
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
