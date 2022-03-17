<template>
<div v-if='response'>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar color="transparent" flat>
            <h2 class="text-3xl  "> <v-icon class="mr-2">em em-female-office-worker</v-icon> ผู้ใช้งาน</h2>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = true" color="success"> <v-icon class="mr-2 ">em em-bust_in_silhouette</v-icon> เพิ่มผู้ใช้</v-btn>
        </v-toolbar>
        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon class="mr-2"  >em em-female-office-worker</v-icon>
                    เพิ่มผู้ใช้<v-spacer></v-spacer>
                    <v-btn @click="dialog = false" color="error">ยกเลิก</v-btn>
                </v-card-title>
                <v-card-text>
                    <Core-Error :error="error"></Core-Error>
                    <form @submit.prevent="createUser()">
                        {{$required}}
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
                        <v-checkbox v-model="formPermission.is_staff" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="ผู้ช่วยแอดมิน" hide-details></v-checkbox>
                        <br>
                        <div class="flex"> 
                            <v-spacer></v-spacer>
                            <v-btn type="submit" color="success"> <v-icon class="mr-2" >em em-floppy_disk</v-icon> บันทึกข้อมูล</v-btn>
                        </div>
                    </form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <div>
            <v-text-field v-model="search" prepend-inner-icon="em em-mag_right" outlined label="ค้นหา"></v-text-field>
            <v-btn @click="startup()" color="success"> <v-icon class="mr-2" >em em-mag_right</v-icon> ค้นหา</v-btn>

            <v-select outlined :items="permissionList" v-model="permission" item-text="txt" item-value="value" prepend-inner-icon="em em-busts_in_silhouette" label="ระดับผู้ใช้งาน" @change="startup()"></v-select>
            <v-select outlined :items="foreignerList" v-model="foreigner" item-text="txt" item-value="value" prepend-inner-icon="em em-house_buildings" label="ที่อยู่ผู้ใช้" @change="startup()"></v-select>
            <v-select outlined :items="blacklistList" v-model="blacklist" item-text="txt" item-value="value" prepend-inner-icon="em em-no_entry_sign" label="blacklist" @change="startup()"></v-select>
            <v-select outlined :items="register_byList" v-model="register_by" item-text="txt" item-value="value" prepend-inner-icon="em em-desktop_computer" label="การสมัครสมาชิก" @change="startup()"></v-select>

        </div>

        <v-data-table :headers="headers" :items="items.results" class="elevation-1"></v-data-table>
        {{page}}
        <v-pagination v-model="page" :length="items.count/3"></v-pagination>
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
            headers: [],
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
                    txt: 'แอดมิน',
                    value: '&is_superuser=true'
                },
                {
                    txt: 'ผู้ช่ายแอดมิน',
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
            if (this.items.results.length > 0) {
                this.headers = _.map(Object.keys(this.items.results[0]), (r) => {
                    return {
                        text: r,
                        value: r
                    }
                })
            }
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
        async updatePermission(userId){
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
