<template>
<v-app class="bg-main" v-if="response">
    <Core-Loading></Core-Loading>
    <UserMenu-MainMenu></UserMenu-MainMenu> 
    <v-main >
        <!-- <Core-Notification /> -->
        <div class="p-10 ">
             <Bg-Test></Bg-Test>
            <Nuxt />
        </div>

    </v-main>

</v-app>
</template>

<script>
import {
    Auth} from '@/vuexes/auth'
import {Cash} from '@/vuexes/cash'
export default {
    name: 'DefaultLayout',
    data() {
        return {
            isDrawerOpen: false,
            user: {},
            response: false
        }
    },
    async created() {
     
        await this.initial()
            await Auth.checkUser();
    },
    methods: {
        async initial() {
            await Auth.checkToken();
            await Cash.getEnv();
            this.user = await Auth.setUser();
            await this.checkUser();
            this.response = (this.user.id) ? true : false; 
        },
        async checkUser() {
            let user = await Auth.getUser();  
            if (!user.id) {
              await this.$router.replace(`/auth/login`)
            }
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai&display=swap');
*{
   font-family: 'IBM Plex Sans Thai', sans-serif!important;
} 
</style>