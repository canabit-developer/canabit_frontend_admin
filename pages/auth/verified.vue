<template>
<div>

    <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center  ">
            <router-link to="/" class="d-flex align-center">
                <img class="h-14" src="~/static/images/logos/canabit_vector.svg" alt="">
            </router-link>
        </v-card-title>
        <v-card-text class="d-flex align-center">
            <v-divider></v-divider>
            <v-divider></v-divider>
        </v-card-text>
        <!-- title -->
        <v-card-text class="mt-3" v-if="activated">
            <center> <span class="em em-radio_button text-5xl animate__animated  animate__pulse animate__infinite	infinite"></span></center>
            <p class="text-2xl font-weight-semibold text--primary mb-2 text-center ">
                Activating...
            </p>
            <center>
                <p class="mb-2">
                    Please Wait
                </p>
            </center>
        </v-card-text>
        <div v-else>
            <v-card-text class="mt-4">
                <center> <span class="em em-raised_hands text-6xl animate__animated  animate__pulse animate__infinite	infinite"></span></center>
                <p class="text-2xl font-weight-semibold mb-2 text-center text-green-600">
                    Activate Success
                </p>
                <center>
                    <p class="mb-2">
                        You can login with your account now.
                    </p>
                </center>
            </v-card-text>

            <v-card-actions class="flex flex-col w-full">
                <v-btn dark block @click="$router.push('/auth/login')" class="bg-primary-g mt-6">Back to login</v-btn>
            </v-card-actions>
        </div>

    </v-card>

</div>
</template>

<script>
import {
    Core
} from '~/vuexes/core'
export default {
    layout: 'root',
    data: () => {
        return ({
            activated: true
        })
    },
    async created() {
        await this.initial()
    },
    methods: {
        async initial() {
            this.activated = true
            let activate = await Core.postHttp(`/api/auth/v2/verify-registration/`,{
                "user_id": this.$route.query.user_id,
                "timestamp": this.$route.query.timestamp,
                "signature": this.$route.query.signature,
            })
            console.log(activate)
             this.activated = false
        }
    }
}
</script>
 