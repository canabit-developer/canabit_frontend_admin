<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-icon class="mr-2">em em-clipboard</v-icon> KYC
            </h2>
            <v-spacer></v-spacer>
            <!-- <v-btn @click="openDialog()">Add Data</v-btn> -->
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.id="{ item, index }">
                {{index+1}}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn> 
            </template>

               <template v-slot:item.user_full="{ item }">
                 <div>
                     {{item.user_full}} 
                 </div>
            </template> 
            <template v-slot:item.image_card="{ item }">
                <div class="p-4"><img :src="item.image_card" class="w-20 h-auto shadow-xl" /></div>
            </template>
            <template v-slot:item.image_selfie="{ item }">
                <div class="p-4"><img :src="item.image_selfie" class="w-20 h-auto shadow-xl" /></div>
            </template>
            <template v-slot:item.image_selfie="{ item }">
                <div class="p-4"><img :src="item.image_selfie" class="w-20 h-auto shadow-xl" /></div>
            </template>

            <template v-slot:item.activated="{ item }">
                <div>
                    <UI-IsCheck text="ภาพถ่ายสำเนาบัตรประจำตัวประชาชน มีปัญหา" :active="item.user_verified"></UI-IsCheck>
                    <UI-IsCheck text="ภาพถ่าย selfie กับบัตรประจำตัวประชาชน มีปัญหา" :active="item.user_verified"></UI-IsCheck>
                    <UI-IsCheck text="ชื่อ-สกุล ไม่ตรงกับบัตรประจำตัวประชาชน" :active="item.user_verified"></UI-IsCheck>
                    <UI-IsCheck text="เลขบัตรประชาชน ไม่ตรงกับบัตรประจำตัวประชาชน" :active="item.user_verified"></UI-IsCheck>
                </div>
            </template>

            <template v-slot:item.user_verified="{ item }">
                <div>
                    <UI-IsActive :active="item.user_verified"></UI-IsActive>
                </div>
            </template> 
        </v-data-table>
        <!-- <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination> -->

        <v-dialog v-model="dialog" fullscreen scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2">em em-clipboard</v-icon>
                    {{(form.id)?"แก้ไข":"เพิ่ม"}} KYC ของผู้ใช้
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="flex flex-col md:flex-row">
                        <div class="w-full md:w-1/2 p-4">
                            <form @submit.prevent="(form.id)?update():store()">
                                <h2>
                                    <v-icon class="mr-2">em em-bust_in_silhouette</v-icon> {{form.user_full}}
                                </h2>
                                <!-- <v-text-field v-model="form.image_card" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="image_card" hide-details></v-text-field>
                                <v-text-field v-model="form.image_selfie" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="image_selfie" hide-details></v-text-field>
                                -->
                                <!-- <v-text-field v-model="form.user_verified" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_image_card_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_image_card_error" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_image_selfie_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_image_selfie_error" hide-details></v-text-field>
                       -->
                                <v-text-field v-model="form.phone_number" class="mt-4" prepend-inner-icon="em em-iphone" outlined label="หมายเลขโทรศัพท์" hide-details></v-text-field>
                                <!-- <v-text-field v-model="form.phone_verified" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="phone_verified" hide-details></v-text-field> -->
                                <!-- <v-text-field v-model="form.refferal_code" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="refferal_code" hide-details></v-text-field> -->
                                <!--                         
                        <v-text-field v-model="form.user_id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_id" hide-details></v-text-field> -->
                                <!-- <v-text-field v-model="form.user_verified_id_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_id_error" hide-details></v-text-field>
                        <v-text-field v-model="form.user_verified_name_error" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="user_verified_name_error" hide-details></v-text-field>
                        -->
                                <v-text-field v-model="form.card_id" class="mt-4" prepend-inner-icon="em em-1234" outlined label="เลขประจำตัวประชาชน" hide-details></v-text-field>

                                <v-checkbox label="ผ่านการอนุมัติยืนยันตัวตน" v-model="form.user_verified"></v-checkbox>
                                <v-checkbox label="ยืนยันตัวตนผ่านมือถือ (OTP) แล้ว" v-model="form.phone_verified"></v-checkbox>

                                <v-checkbox label="ภาพถ่ายสำเนาบัตรประจำตัวประชาชน มีปัญหา" v-model="form.user_verified_image_card_error"></v-checkbox>
                                <v-checkbox label="ภาพถ่าย selfie กับบัตรประจำตัวประชาชน มีปัญหา" v-model="form.user_verified_image_selfie_error"></v-checkbox>
                                <v-checkbox label="เลขบัตรประชาชน ไม่ตรงกับบัตรประจำตัวประชาชน" v-model="form.user_verified_id_error"></v-checkbox>
                                <v-checkbox label="ชื่อ-สกุล ไม่ตรงกับบัตรประจำตัวประชาชน" v-model="form.user_verified_name_error"></v-checkbox>
                                <div class="mt-4 flex">
                                    <v-spacer />
                                    <v-btn type="submit" color="success">
                                        <v-icon class="mr-2">em em-floppy_disk</v-icon> บันทึกข้อมูล
                                    </v-btn>
                                </div>
                            </form>
                        </div>
                        <div class="w-full md:w-1/ p-4">
                            <h2>
                                <v-icon class="mr-2"> em em-camera</v-icon> ภาพถ่ายสำเนาบัตรประจำตัวประชาชน
                            </h2>
                            <img v-if="form.image_card" :src="$url+form.image_card" alt="">
                            <h3 v-else class="p-4 bg-gray-100"> ไม่มีภาพ</h3>
                            <br><br>
                            <h2>
                                <v-icon class="mr-2"> em em-camera_with_flash</v-icon> ภาพถ่าย Selfie กับ ประจำตัวประชาชน
                            </h2>
                            <img v-if="form.image_selfie" :src="$url+form.image_selfie" alt="">
                            <h3 v-else class="p-4 bg-gray-100"> ไม่มีภาพ</h3>
                        </div>
                    </div>

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
                },
                {
                    text: "ผู้ใช้",
                    value: "user_full",
                    width:300
                },
                {
                    text: "เลขประจำตัวประชาชน",
                    value: "card_id"
                },
                // {
                //     text: "image_card",
                //     value: "image_card"
                // }, {
                //     text: "image_selfie",
                //     value: "image_selfie"
                // },
                {
                    text: "หมายเลขโทรศัพท์",
                    value: "phone_number"
                },

                {
                    text: "สถานะ",
                    value: "user_verified"
                },
                {
                    text: "หมายเหตุ",
                    value: "activated"
                },
                //   {   text: "user_verified_image_card_error",
                //     value: "user_verified_image_card_error"
                // }, {
                //     text: "user_verified_image_selfie_error",
                //     value: "user_verified_image_selfie_error"
                // }, {
                //     text: "phone_verified",
                //     value: "phone_verified"
                // }, {
                //     text: "refferal_code",
                //     value: "refferal_code"
                // }, {
                //     text: "created_at",
                //     value: "created_at"
                // }, {
                //     text: "updated_at",
                //     value: "updated_at"
                // }, {
                //     text: "user_verified_id_error",
                //     value: "user_verified_id_error"
                // }, {
                //     text: "user_verified_name_error",
                //     value: "user_verified_name_error"
                // },  
                {
                    text: "การจัดการ",
                    value: "actions"
                }
            ],
            page: 1,
            maxPage: 10,
            search: "",
            form: {},
            dialog: false,

        };
    },
    async created() {
        await this.startup();
        // await this.geData();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/adminaccount/kyc/?page=${this.page}&search=${this.search}`);
        },
        async store() {

        },
        async update() {
            delete this.form.image_card
            delete this.form.image_selfie
            let user = await Core.getHttp(`/api/adminaccount/userprofile/${this.form.user}/`)
            let data = await Core.putHttpAlert(`/api/adminaccount/kyc/${this.form.id}/`, this.form)
            await Core.sentEmail('ผลการตรวจสอบข้อมูลส่วนตัว การยืนยันตัวตน(KYC)', user.email, `
                <h1 >ผลการตรวจสอบข้อมูลส่วนตัว การยืนยันตัวตน(KYC) : ${(this.form.user_verified)?'<span style="color:green!important;">ผ่าน</span>':'<span style="color:red!important;">ไม่ผ่าน</span>'}  </h1>   <br>
                <h2><b>ข้อมูล</b></h2> 
                <h3>1.ภาพถ่ายสำเนาบัตรประจำตัวประชาชน : ${(this.form.user_verified_image_card_error)?'ไม่ผ่าน':'ผ่าน'} </h3> <br>
                <h3>2.ภาพถ่าย selfie  และ  บัตรประจำตัวประชาชน  :  ${(this.form.user_verified_image_selfie_error)?'ไม่ผ่าน':'ผ่าน'} </h3>  <br>
                <h3>3.เลขบัตรประชาชน และ บัตรประจำตัวประชาชน  :  ${(this.form.user_verified_id_error)?'ไม่ตรงกัน':'ตรงกัน'}</h3>  <br>
               <h3>4.ชื่อ-สกุล  และ บัตรประจำตัวประชาชน  :  ${(this.form.user_verified_name_error)?'ไม่ตรงกัน':'ตรงกัน'}</h3>  <br>
            `)
            await this.startup();
        },
        async delete(id) {
            let data = await Core.deleteHttpAlert(`/api/adminaccount/kyc/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminaccount/kyc/${id}/`)
            this.dialog = true;
        },
        async closeDialog() {
            this.form = {};
            this.dialog = false;
        },

        async geData() {
            let data = await Core.getHttp(`https://www.myfxbook.com/private/charts.json?invitation=&showLots=false&showPips=true&showChange=false&showSymbolPips=false&showMain=true&magicNumbers=&symbols=&tags=&days=1,5,2,6,3,7,4&hours=0,4,8,12,16,20,1,5,9,13,17,21,2,6,10,18,22,14,3,7,11,15,19,23&buySell=0,1,6,16&yieldStart=&yieldEnd=&netProfitStart=&netProfitEnd=&selectedTime=1&pipsStart=&pipsEnd=&l=s&accountOid=6214185&startDate=2022-01-01&endDate=2022-12-31&chartType=3&monthType=0&oid=6214185&rand=0.15501768751485212`)
            console.log(data);
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
