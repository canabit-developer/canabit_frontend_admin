<template>
<div v-if='response'>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar color="transparent" flat>
            <h2 class="text-3xl  ">ผู้ใช้งาน</h2>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = true" color="success">เพิ่มผู้ใช้</v-btn>
        </v-toolbar>
        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    เพิ่มผู้ใช้<v-spacer></v-spacer>
                    <v-btn @click="dialog = false" color="error">ยกเลิก</v-btn>
                </v-card-title>
                <v-card-text>
                    <Core-Error :error="error"></Core-Error>
                    <form @submit.prevent="createUser()">
                        <v-text-field v-model="form.username" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="username" hide-details></v-text-field>
                        <v-text-field type="password" v-model="form.password" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="password" hide-details></v-text-field>
                        <v-text-field type="password" v-model="form.password_confirm" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="password_confirm" hide-details></v-text-field>
                        <v-text-field v-model="form.first_name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="first_name" hide-details></v-text-field>
                        <v-text-field v-model="form.last_name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="last_name" hide-details></v-text-field>
                        <v-text-field v-model="form.email" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="email" hide-details></v-text-field>
                        <v-text-field v-model="form.phone_number" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="phone_number" hide-details></v-text-field>
                        <v-checkbox v-model="form.foreigner" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="foreigner" hide-details></v-checkbox>
                        <v-spacer></v-spacer>
                        <v-checkbox v-model="formPermission.is_superuser" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="is_superuser" hide-details></v-checkbox>
                        <v-checkbox v-model="formPermission.is_staff" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="is_staff" hide-details></v-checkbox>
                        <br>
                        <div class="flex"> 
                            <v-spacer></v-spacer>
                            <v-btn type="submit" color="success">Create User</v-btn>
                        </div>
                    </form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <div>
            <v-text-field v-model="search" outlined label="ค้นหา"></v-text-field>
            <v-btn @click="startup()" color="success">ค้นหา</v-btn>

            <v-select outlined :items="permissionList" v-model="permission" item-text="txt" item-value="value" label="ระดับผู้ใช้งาน" @change="startup()"></v-select>
            <v-select outlined :items="foreignerList" v-model="foreigner" item-text="txt" item-value="value" label="ที่อยู่ผู้ใช้" @change="startup()"></v-select>
            <v-select outlined :items="blacklistList" v-model="blacklist" item-text="txt" item-value="value" label="blacklist" @change="startup()"></v-select>
            <v-select outlined :items="register_byList" v-model="register_by" item-text="txt" item-value="value" label="register_byList" @change="startup()"></v-select>

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
                    txt: 'all',
                    value: ''
                },
                {
                    txt: 'admin',
                    value: '&is_superuser=true'
                },
                {
                    txt: 'staff',
                    value: '&is_staff=true'
                },
                {
                    txt: 'user',
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
