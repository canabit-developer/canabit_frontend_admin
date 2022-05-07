<template>
<div v-if='response'>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar color="transparent" flat>
            <h2 class="text-3xl  ">
                <v-icon class="mr-2">em em-female-office-worker</v-icon> ผู้ใช้งาน
            </h2>
            <v-spacer></v-spacer>
            <v-btn outlined @click="dialog = true" color="success">
                <v-icon class="mr-2 ">mdi-account-multiple-plus</v-icon> เพิ่มผู้ใช้
            </v-btn>
        </v-toolbar>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2">em em-female-office-worker</v-icon>
                    เพิ่มผู้ใช้<v-spacer></v-spacer>
                    <v-btn @click="dialog = false" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <Core-Error :error="error"></Core-Error>
                    <form @submit.prevent="createUser()">
                        <v-text-field :rules="[$required]" v-model="form.username" class="mt-4" prepend-inner-icon="em em-bust_in_silhouette" outlined label="ชื่อผู้ใช้งาน" hide-details></v-text-field>
                        <v-text-field type="password" v-model="form.password" class="mt-4" prepend-inner-icon="em em-lock" outlined label="รหัสผ่าน" hide-details></v-text-field>
                        <v-text-field type="password" v-model="form.password_confirm" class="mt-4" prepend-inner-icon="em em-lock" outlined label="ยืนยันรหัสผ่าน" hide-details></v-text-field>
                        <v-text-field v-model="form.first_name" class="mt-4" prepend-inner-icon="em em-man-frowning" outlined label="ชื่อจริง" hide-details></v-text-field>
                        <v-text-field v-model="form.last_name" class="mt-4" prepend-inner-icon="em em-man-frowning" outlined label="นามสกุล" hide-details></v-text-field>
                        <v-text-field v-model="form.email" class="mt-4" prepend-inner-icon="em em-email" outlined label="อีเมล" hide-details></v-text-field>
                        <v-text-field v-model="form.phone_number" class="mt-4" prepend-inner-icon="em em-iphone" outlined label="หมายเลขโทรศัพท์" hide-details></v-text-field>
                        <v-checkbox v-model="form.foreigner" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="ชาวต่างชาติ" hide-details></v-checkbox>
                        <v-spacer></v-spacer>
                        <v-checkbox v-model="formPermission.is_superuser" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="ผู้ใช้พิเศษ" hide-details></v-checkbox>
                        <v-checkbox v-model="formPermission.is_staff" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="แอดมิน" hide-details></v-checkbox>
                        <br>
                        <div class="flex">
                            <v-spacer></v-spacer>
                            <v-btn type="submit" color="success">
                                <v-icon class="mr-2">em em-floppy_disk</v-icon> บันทึกข้อมูล
                            </v-btn>
                        </div>
                    </form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <div class="  w-full mt-6">
            <div class="flex w-full">
                <v-text-field @change="startup()" dense v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
            </div>
            <div class="flex">
                <v-select class="ml-2" dense outlined :items="permissionList" v-model="permission" item-text="txt" item-value="value" prepend-inner-icon="em em-busts_in_silhouette" label="ระดับผู้ใช้งาน" @change="startup()"></v-select>
                <v-select class="ml-2" dense outlined :items="foreignerList" v-model="foreigner" item-text="txt" item-value="value" prepend-inner-icon="em em-house_buildings" label="ที่อยู่ผู้ใช้" @change="startup()"></v-select>
                <v-select class="ml-2" dense outlined :items="blacklistList" v-model="blacklist" item-text="txt" item-value="value" prepend-inner-icon="em em-no_entry_sign" label="blacklist" @change="startup()"></v-select>
                <v-select class="ml-2" dense outlined :items="register_byList" v-model="register_by" item-text="txt" item-value="value" prepend-inner-icon="em em-desktop_computer" label="การสมัครสมาชิก" @change="startup()"></v-select>
            </div> 
        </div>

        <v-data-table :headers="headers" :items="items" class="elevation-1">
            <template v-slot:item.id="{ item,index }">
                {{index+1}}
            </template>
            <template v-slot:item.username="{ item }">
                <div class="flex items-center p-2 " :class="(item.blacklist)?'bg-red-200':''">
                    <img v-if="item.image_profile" class="rounded-full h-10 w-10" :src="$url+item.image_profile" alt="">
                    <img v-else class="rounded-full h-10 w-10" src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" alt="">
                    <div class="ml-2">
                        <span class="font-semibold"> {{item.username}} </span> <br>
                        <span class="text-gray-400 text-sm">{{item.email}}</span>
                        <span class="text-red-600 font-semibold" v-if="item.blacklist"><br>[X BlackList]</span>
                    </div>

                </div>
            </template>
            <template v-slot:item.name="{ item }">
                <span class="font-semibold">{{item.first_name}} {{item.last_name}} </span> <br>
                <span v-if="item.display_name" class="text-gray-400 text-sm">@{{item.display_name}}</span>
            </template>
            <template v-slot:item.address="{ item }">
                <v-chip small v-if="item.foreigner">
                    ชาวต่างชาติ
                </v-chip>
                <span v-if="item.phone_number"> เบอร์ {{item.phone_number}}</span><br>
                {{item.address}} {{(item.province)?`จ.${item.province}`:``}} {{(item.amphur)?`อ.${item.amphur}`:``}} {{(item.district)?`ต.${item.district}`:``}} {{item.zipcode}}
            </template>
            <template v-slot:item.permission="{ item }">
                <UI-IsChecks text="Admin" :active="item.is_superuser"></UI-IsChecks>
                <UI-IsChecks text="Staff" :active="item.is_staff"></UI-IsChecks>
            </template>
            <template v-slot:item.is_active="{ item }">
                <UI-IsChecks text="ยืนยันอีเมล์" :active="item.is_active"></UI-IsChecks>
                <!-- <UI-IsChecks text="ยืนยันอีเมล์" ></UI-IsChecks>
                {{item.is_staff}} -->
            </template>
            <template v-slot:item.active="{ item }">
                <v-btn small color="warning" @click="$router.push(`/user/${item.id}/`)"  >แก้ไขข้อมูล</v-btn>
            </template>
        </v-data-table>
        <!-- <v-pagination v-model="page" :length="items.count/3"></v-pagination> -->
    </div>

</div>
</template>

<script>
import {
    Core
} from '@/vuexes/core'
import {
    Auth
} from '@/vuexes/auth'
import {
    Web
} from '@/vuexes/web'
import _ from 'lodash'
export default {
    data() {
        return ({

            response: false,
            items: [],
            headers: [{
                    "text": "ลำดับ",
                    "value": "id"
                },
                {
                    "text": "ผู้ใช้",
                    "value": "username",
                    "width": "300"
                },
                {
                    "text": "ชื่อ-สกุล",
                    "value": "name",
                    "width": "200"
                },
                {
                    "text": "ที่อยู่",
                    "value": "address",
                    "width": "200"
                },
                {
                    "text": "เพอร์มิชชัน",
                    "value": "permission"
                },
                {
                    "text": "ยืนยันอีเมล์",
                    "value": "is_active"
                },

                {
                    "text": "สมัครสมาชิกจาก",
                    "value": "register_by"
                },
                {
                    "text": "เข้าสู่ระบบล่าสุด",
                    "value": "last_login"
                },
                {
                    "text": "สร้างเมื่อ",
                    "value": "created_at"
                },
                {
                    "text": "อัพเดทล่าสุด",
                    "value": "updated_at"
                },
                {
                    "text": "จัดการ",
                    "value": "active"
                }
            ],
            form: {},
            formPermission: {},
            dialog: false,
            error: [],
            search: '',
            page: 1,

            permission: '',
            permissionList: [{
                    txt: 'ทั้งหมด',
                    value: ''
                },
                {
                    txt: 'ซุปเปอร์แอดมิน',
                    value: '&is_superuser=true'
                },
                {
                    txt: 'แอดมิน',
                    value: '&is_staff=true'
                },
                {
                    txt: 'ผู้ใช้ทั่วไป',
                    value: '&is_superuser=false&is_staff=false'
                },
            ],
            foreigner: '',
            foreignerList: [{
                    txt: 'ทั้งหมด',
                    value: ''
                },
                {
                    txt: 'ชาวต่างชาติ',
                    value: '&foreigner=true'
                },
                {
                    txt: 'ชาวไทย',
                    value: '&foreigner=false'
                },
            ],
            blacklist: '',
            blacklistList: [{
                    txt: 'ทั้งหมด',
                    value: ''
                },
                {
                    txt: 'ติด Blacklist',
                    value: '&blacklist=true'
                },
                {
                    txt: 'ไม่ติด Blacklist',
                    value: '&blacklist=false'
                },
            ],
            register_by: '',
            register_byList: [{
                    txt: 'ทั้งหมด',
                    value: ''
                },
                {
                    txt: 'สมัครสมาชิก',
                    value: '&register_by=Web'
                },
                {
                    txt: 'Facebook',
                    value: '&register_by=Facebook'
                },
                {
                    txt: 'Google',
                    value: '&register_by=Google'
                },
            ],

        })
    },
    async created() { 
        await Web.switchLoad(true)
        await this.startup();
        this.response = true;
        await Web.switchLoad(false)
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/account/userprofile/?page=${this.page}&search=${this.search}${this.permission}${this.foreigner}${this.blacklist}${this.register_by}`)
            // if (this.items.results.length > 0) {
            //     this.headers = _.map(Object.keys(this.items.results[0]), (r) => {
            //         return {
            //             text: r,
            //             value: r
            //         }
            //     })
            // }
        },
        async createUser() {
            await Web.switchLoad(true)
            let user = await Core.postHttpAlert(`/api/auth/v2/register/`, this.form)
            if (user.id) {
                this.error = {}
                await this.updatePermission(user.id);
                await this.startup();
                this.dialog = false;
            } else {
                this.error = user;
            }
            await Web.switchLoad(false)
        },
        async updatePermission(userId) {
            this.formPermission.is_active = true
            let user = await Core.putHttp(`/api/account/userprofile/${userId}/`, this.formPermission)
        }
    },
    watch: {
        async page(newVal, oldVal) {
            await this.startup();
        }
    },
    computed: {

    }
}
</script>

<style>

 </style>
