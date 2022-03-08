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
        <v-card-text class="mt-3">
            <center> <span class="em em-mailbox_with_mail text-6xl  animate__animated  animate__pulse animate__infinite	infinite"></span></center>
            <p class="text-2xl font-weight-semibold text--primary mb-2 text-center ">
                Almost Done
            </p>
            <center>
                <p class="mb-2">
                    Please check your email for activate to login. <br>
                    Take 5 - 30 minutes to send an email.
                </p>
            </center>
        </v-card-text>

        <!-- social links -->
        <v-card-actions class="flex flex-col w-full">
            <v-btn dark block @click="$router.push('auth/login')" class="bg-primary-g mt-6">Back to login</v-btn>
        </v-card-actions>
    </v-card>

</div>
</template>

<script>
export default {
    layout: 'root',
}
</script>

 