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
                    <v-btn color="error">ยกเลิก</v-btn>
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
                        <v-text-field v-model="form.foreigner" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="foreigner" hide-details></v-text-field>
                        <br>
                        <div class="flex">
                            <v-spacer></v-spacer>
                            <v-btn type="submit" color="success">Create User</v-btn>
                        </div>
                    </form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-data-table :headers="headers" :items="items" :items-per-page="100" class="elevation-1"></v-data-table>
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
            dialog: false,
            error: []
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
            this.items = await Core.getHttp(`/api/account/userprofile/`)
            this.headers = _.map(Object.keys(this.items[0]), (r) => {
                return {
                    text: r,
                    value: r
                }
            })
        },
        async createUser() {
            await Web.switchLoad(true)
            let user = await Core.postHttpAlert(`/api/auth/v2/register/`, this.form)
            if (user.id) {
                this.error = {}
                await this.startup();
                this.dialog = false;
            } else {
                this.error = user;
            }
            await Web.switchLoad(false)
        }
    },
    computed: {

    }
}
</script>

<style>

 </style>
