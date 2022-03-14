<template>
<div>
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">

            <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                <div class="px-5 py-7">
                    <center>
                        <img class="h-14" src="~/static/images/logos/canabit_vector.svg" alt="">
                    </center>
                    <div class="error">
                
                        <div v-if="error.detail">
                            <v-alert dense outlined text type="error" :value="true">
                                {{error.detail}}
                            </v-alert>
                        </div>
                          <div v-if="errorRegister.non_field_errors">
                            <v-alert dark dense    v-for="(message,i) in errorRegister.non_field_errors" :key="i" type="error" :value="true">
                                {{message}}
                            </v-alert>
                        </div>
                        <div v-if="errorRegister.email">
                            <v-alert dense outlined text v-for="(message,i) in errorRegister.email" :key="i" type="error" :value="true">
                                {{message}}
                            </v-alert>
                        </div>
                        <div v-if="errorRegister.password">
                            <v-alert dense outlined text v-for="(message,i) in errorRegister.password" :key="i" type="error" :value="true">
                                {{message}}
                            </v-alert>
                        </div>

                        <div v-if="errorRegister.phone_number">
                            <v-alert dense outlined text v-for="(message,i) in errorRegister.phone_number" :key="i" type="error" :value="true">
                                {{message}}
                            </v-alert>
                        </div>
                    </div>
                    <form @submit.prevent="login" class="mt-4">
                        <v-text-field prepend-inner-icon="mdi-card-account-details" v-model="form.username" required color="primary" outlined label="Username" placeholder="email,phone number" hide-details class="mb-3"></v-text-field>
                        <br>
                        <v-text-field prepend-inner-icon="mdi-form-textbox-password" v-model="form.password" required color="primary" outlined :type="isPasswordVisible ? 'text' : 'password'" label="Password" placeholder="············" :append-icon="isPasswordVisible ? `mdi-eye-off-outline` : `mdi-eye-outline`" hide-details @click:append="isPasswordVisible = !isPasswordVisible"></v-text-field>

                        <!-- <div class="d-flex align-center justify-space-between flex-wrap">
                            <v-spacer></v-spacer>

                            <router-link class="mt-1" :to="{path:'/auth/forgot'}">
                                Forgot Password?
                            </router-link>
                        </div> -->

                        <v-btn type="submit" x-large dark block class="bg-primary-g mt-6 font-semibold">
                            เข้าสู่ระบบ
                        </v-btn>
                    </form>
                </div>
                <!-- <div class="p-5">
                    <div class="grid grid-cols-3 gap-1">
                        <button type="button" class="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block">MailUp</button>
                        <button type="button" class="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block">Google</button>
                        <button type="button" class="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block">Github</button>
                    </div>
                </div> -->
                <!-- <div class="py-5">
                    <div class="grid grid-cols-2 gap-1">
                        <div class="text-center sm:text-left whitespace-nowrap">
                            <v-btn color="success">text</v-btn>
                        </div>
                        <div class="text-center sm:text-right whitespace-nowrap">
                            <v-btn color="success">text</v-btn>
                        </div>
                    </div>
                </div> -->
            </div>

        </div>
    </div>

 
</div>
</template>

<script>
import {
    Core
} from '~/vuexes/core'
import {
    Web
} from '~/vuexes/web'
import {
    Auth
} from '~/vuexes/auth'

export default {
    layout: 'root',
    data: () => {
        return ({
            isPasswordVisible: false,
            form: {
                login: '',
                password: ''
            },
            error: {},
            errorRegister:{}
        })
    },
    async created() {
        await Auth.checkUser();
    },
    methods: {
        async login(alert = true) {
            let user = await Core.postHttp(`/api/auth/v2/check/`, this.form)
            if (user.username) {
                this.form.username = user.username
                let signin = await Auth.login(this.form)
                if (signin.key) {
                    await Auth.storeToken(signin.key)
                    await Auth.storeTokenToStorage(signin.key)
                    await this.$router.replace(`/`)
                    return true
                } else {
                    if (alert) {
                        this.errorRegister = signin
                    }
                    return false
                }
            }
        },
        async callback(user) {
            await Web.switchLoad(true)
            this.form = user.login
            let logined = await this.login(false)
            if (!logined) {

                let registerUser = await Auth.register(user.register)
                if (registerUser.id) {
                    await Web.switchLoad(false)
                    await this.generateKyc(registerUser.id);
                    await this.$router.replace(`/auth/verify`)
                    console.log(registerUser)
                } else {
                    this.errorRegister = registerUser
                    await Web.switchLoad(false)
                }
            } else {
                this.error = logined
            }
            await Web.switchLoad(false)
            console.log(user);
        },

        async generateKyc(userId) {
            let kyc = await Core.postHttp(`/api/account/kyc/`, {
                user: userId
            })
            if (kyc.id) {
                this.$vs.notification({
                    color: 'success',
                    title: 'สร้างข้อมูล KYC สำเร็จแล้ว',
                })
            } else {
                this.$vs.notification({
                    color: 'danger',
                    title: 'สร้างข้อมูล KYC ไม่สำเร็จ',
                })
            }
        },
    }
}
</script>
