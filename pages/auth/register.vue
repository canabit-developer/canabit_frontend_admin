<template>
  <div>
    <v-card class="auth-card">
      <!-- logo -->
      <v-card-title class="d-flex align-center justify-center py-7">
        <router-link to="/" class="d-flex align-center">
          <img
            class="h-14"
            src="~/static/images/logos/canabit_vector.svg"
            alt=""
          />
        </router-link>
      </v-card-title>

      <!-- title -->
      <v-card-text>
        <p class="text-2xl font-weight-semibold text--primary mb-2 text-center">
          Adventure starts here 🚀
        </p>
        <p class="mb-2 text-center">Make your app management easy and fun!</p>
      </v-card-text>

      <!-- login form -->
      <v-card-text>
        <div v-if="error.email">
          <v-alert
            dense
            outlined
            text
            v-for="(message, i) in error.email"
            :key="i"
            type="error"
            :value="true"
          >
            {{ message }}
          </v-alert>
        </div>
        <div v-if="error.password">
          <v-alert
            dense
            outlined
            text
            v-for="(message, i) in error.password"
            :key="i"
            type="error"
            :value="true"
          >
            {{ message }}
          </v-alert>
        </div>

        <div v-if="error.phone_number">
          <v-alert
            dense
            outlined
            text
            v-for="(message, i) in error.phone_number"
            :key="i"
            type="error"
            :value="true"
          >
            {{ message }}
          </v-alert>
        </div>

        <!-- <v-alert type="error" :value="true">
                sdsd
            </v-alert>
            <v-alert type="error" :value="true">
                sdsd
            </v-alert>
            <v-alert type="error" :value="true">
                sdsd
            </v-alert> -->

        <form @submit.prevent="register()">
          <v-text-field
            v-model="form.username"
            class="mt-4"
            prepend-inner-icon="mdi-card-account-details"
            outlined
            label="Username"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            class="mt-4"
            prepend-inner-icon="mdi-email-outline"
            outlined
            label="Email"
            hide-details
          ></v-text-field>

          <v-text-field
            v-model="form.first_name"
            class="mt-4"
            prepend-inner-icon="mdi-account-outline"
            outlined
            label=" Frist Name"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="form.last_name"
            class="mt-4"
            prepend-inner-icon="mdi-account-outline"
            outlined
            label=" Last Name"
            hide-details
          ></v-text-field>

          <v-text-field
            v-model="form.phone_number"
            class="mt-4"
            type="text"
            outlined
            prepend-inner-icon="mdi-cellphone"
            label="Number"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            class="mt-4"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
            outlined
            label="Password"
            hide-details
          ></v-text-field>

          <v-text-field
            v-model="form.password_confirm"
            class="mt-4"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
            outlined
            label="Confirm Password"
            hide-details
          ></v-text-field>
          <!-- <v-text-field class="mt-4" prepend-inner-icon="mdi-lock-outline" outlined label="RefferalCode" hide-details></v-text-field> -->

          <v-btn type="submit" x-large dark block class="bg-primary-g mt-6">
            Sign Up
          </v-btn>
        </form>
      </v-card-text>

      <!-- create new account  -->
      <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
        <span class="me-2"> Already have an account? </span>
        <router-link :to="{ path: '/auth/login' }" class="font-semibold">
          Sign in instead
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Core } from "~/vuexes/core";
import { Web } from "~/vuexes/web";
import { Auth } from "~/vuexes/auth";
export default {
  layout: "root",
  data: () => {
    return {
      form: {
        password: "Pautn1234",
        username: "pongvarid2020",
        first_name: "maneewan",
        last_name: "maneewan",
        email: "pongvarid2020@gmail.com",
        display_name: "Pongvarid",
        phone_number: "0988203179",
        password_confirm: "Pautn1234",
      },
      error: {},
    };
  },
  async created() {
     
  },
  methods: {
    async initial() {
        
      await Web.switchLoad(true);
    },
    async register() {
      this.error = {};
      await Web.switchLoad(true);
      let user = await Auth.register(this.form);

      if (user.id) {
        await this.generateKyc(user.id);
        await Web.switchLoad(false);
        await Web.alert(`OK`, `success`, `Register is success`);
        await this.$router.replace(`/auth/verify`);
      } else {
        this.error = user;
        await Web.switchLoad(false);
      }
    },
    async generateKyc(userId) {
       let kyc = await Core.postHttp(`/api/account/kyc/`,{user:userId})
       if(kyc.id){
            this.$vs.notification({
            color:'success', 
            title: 'สร้างข้อมูล KYC สำเร็จแล้ว', 
          })
       }else{
             this.$vs.notification({
            color:'danger', 
            title: 'สร้างข้อมูล KYC ไม่สำเร็จ', 
          })
       }
    },
  },
};
</script>

 