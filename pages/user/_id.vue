<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-btn @click="$router.go(-1)" fab outlined color="primary">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>&nbsp;{{form.first_name}}&nbsp; {{form.last_name}}
            </h2>
            <v-spacer></v-spacer>
        </v-toolbar>
        <center>
            <img v-if="form.image_profile" class="rounded-full w-48 h-48" :src="$url+form.image_profile" alt="">
            <img v-else class="rounded-full  w-48 h-48" src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" alt="">
        </center>
        <br><br>
        <form @submit.prevent="update()">
          <v-text-field v-model="form.first_name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="first_name" hide-details></v-text-field>
            <v-text-field v-model="form.last_name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="last_name" hide-details></v-text-field>
            <v-text-field v-model="form.address" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="address" hide-details></v-text-field>
                       <v-text-field v-model="form.province" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="province" hide-details></v-text-field>

           <v-text-field v-model="form.amphur" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="amphur" hide-details></v-text-field>
                       <v-text-field v-model="form.district" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="district" hide-details></v-text-field>
            <v-text-field v-model="form.zipcode" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="zipcode" hide-details></v-text-field>

            <v-text-field v-model="form.created_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="created_at" hide-details></v-text-field>
            <v-text-field v-model="form.date_joined" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="date_joined" hide-details></v-text-field>
            <v-text-field v-model="form.display_name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="display_name" hide-details></v-text-field>
            <v-text-field v-model="form.email" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="email" hide-details></v-text-field>
          
            <v-checkbox v-model="form.foreigner" label="foreigner"></v-checkbox>
            <v-text-field v-model="form.image_profile" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="image_profile" hide-details></v-text-field>
            <v-checkbox v-model="form.is_staff" label="is_staff"></v-checkbox>
            <v-checkbox v-model="form.is_superuser" label="is_superuser"></v-checkbox>
            <v-text-field v-model="form.last_login" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="last_login" hide-details></v-text-field>
        
            <v-text-field v-model="form.other_referral_code" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="other_referral_code" hide-details></v-text-field>
            <v-text-field v-model="form.password" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="password" hide-details></v-text-field>
            <v-text-field v-model="form.phone_number" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="phone_number" hide-details></v-text-field>
            <v-text-field v-model="form.register_by" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="register_by" hide-details></v-text-field>
            <v-text-field v-model="form.status" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="status" hide-details></v-text-field>
            <v-text-field v-model="form.updated_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="updated_at" hide-details></v-text-field>
            <v-text-field v-model="form.username" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="username" hide-details></v-text-field>
             <v-checkbox v-model="form.blacklist" label="blacklist"></v-checkbox>
            <div class="mt-4 flex">
                <v-spacer />
                <v-btn type="submit" color="success">บันทึกข้อมูล</v-btn>
            </div>
        </form>

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
            form: {},

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.form = await Core.getHttp(`/api/account/userprofile/${this.$route.params.id}/`);

        },

        async update() {
            delete this.form.image_profile
            let data = await Core.putHttpAlert(`/api/account/userprofile/${this.form.id}/`, this.form)
            await this.startup();
        },

    },
    watch: {

    },
};
</script>

<style>
</style>
