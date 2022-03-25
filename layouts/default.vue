<template>
<v-app class="bg-main" v-if="response">
    <Core-Loading></Core-Loading>
    <UserMenu-MainMenu></UserMenu-MainMenu>

    <v-main >
        <!-- <Core-Notification /> -->
        <div class=" ">
            <Nuxt />
        </div>

    </v-main>

</v-app>
</template>

<script>
import {
    Auth} from '@/vuexes/auth'
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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai&display=swap');
*{
    font-family: 'Noto Sans Thai', sans-serif!important;
} 
</style>