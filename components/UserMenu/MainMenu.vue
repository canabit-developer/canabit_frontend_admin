<template>
<div class="bg-main">
    <!-- <v-app-bar app flat absolute  >
        <div class=" ">
            <div class=" align-center ">
         
                <v-app-bar-nav-icon class="d-block d-lg-none me-2" @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>

                <v-spacer></v-spacer>

            </div>
        </div>
    </v-app-bar>  -->

    <v-navigation-drawer app   v-model="isDrawerOpen">
        <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
            <router-link to="/" class="d-flex align-center text-decoration-none w-full">
                <center>
                    <v-slide-x-transition>
                        <img class="h-14" src="~/static/images/logos/canabit_vector.svg" alt="">
                    </v-slide-x-transition>
                </center>
            </router-link>
        </div>

        <div class="p-6 flex flex-col items-center">
            <!-- <v-badge color="bg-yellow-500" :content="user.tier" overlap>
                <v-img v-if="user.image_profile" class="shadow-2xl rounded-full h-36 w-36" :src="user.image_profile"> </v-img>
                <v-img v-else class="shadow-2xl rounded-full h-36 w-36" src="https://i.pinimg.com/originals/4a/6a/cb/4a6acb8ab84a58ca85ef817b02de7067.jpg"> </v-img>

            </v-badge> -->

            <!-- <h2 v-if="user.display_name" class="text-2xl font-semibold">{{user.display_name}}</h2>
            <h2 v-else class="text-2xl font-semibold">{{user.first_name}}</h2>
            <h2>{{user.email}}</h2> -->
        </div>

        <v-list expand shaped class="vertical-nav-menu-items pr-5">
            <!-- <UserMenu-NavbarLink path="/" title="หน้าแรก" icon="em em-house"></UserMenu-NavbarLink> -->
            <UserMenu-NavbarLink path="/user" title="ผู้ใช้งาน" icon="em em-female-office-worker"></UserMenu-NavbarLink>
            <UserMenu-NavbarLink path="/kyc" title="kyc" icon="em em-clipboard"></UserMenu-NavbarLink>
             <UserMenu-NavbarLink path="/tier" title="tier" icon="em em-trophy"></UserMenu-NavbarLink>
             <UserMenu-NavbarLink path="/commission" title="commission" icon="em em-bank"></UserMenu-NavbarLink>
            <UserMenu-NavbarLink path="/broker" title="Broker" icon="em em-bank"></UserMenu-NavbarLink>
            <UserMenu-NavbarLink path="/store" title="store" icon="em em-trophy"></UserMenu-NavbarLink>
            <v-divider></v-divider>
            <UserMenu-NavMenuGroup icon="em em-chart" title="EA">
                <UserMenu-NavbarLink class="ml-4" path="/ea" title="Product" icon="em em-shopping_trolley"></UserMenu-NavbarLink>
                <UserMenu-NavbarLink class="ml-4" path="/ea/user/" title="user" icon="em em-busts_in_silhouette"></UserMenu-NavbarLink>
                <UserMenu-NavbarLink class="ml-4" path="/ea/detail/" title=" Request Test" icon="em em-chart_with_upwards_trend"></UserMenu-NavbarLink>
            </UserMenu-NavMenuGroup>
            <v-divider></v-divider>
            <UserMenu-NavMenuGroup icon="em em-bookmark_tabs" title="copytrade">
                <UserMenu-NavbarLink class="ml-4" path="/copytrade" title="Product" icon="em em-shopping_trolley"></UserMenu-NavbarLink>
                <UserMenu-NavbarLink class="ml-4" path="/copytrade/order/" title="Order" icon="em em-clipboard"></UserMenu-NavbarLink>
                <!-- <UserMenu-NavbarLink path="/ea/detail/" title=" Request Test" icon="mdi-crown-outline"></UserMenu-NavbarLink> -->
            </UserMenu-NavMenuGroup>
            <v-divider></v-divider>
            <UserMenu-NavMenuGroup icon="em em-arrow_double_down" title="indicator">
                <UserMenu-NavbarLink class="ml-4" path="/indicator" title="Product" icon="em em-shopping_trolley"></UserMenu-NavbarLink>
                  <UserMenu-NavbarLink class="ml-4" path="/indicator/detail" title="Detail" icon="em em-shopping_trolley"></UserMenu-NavbarLink>
                <!-- <UserMenu-NavbarLink path="/ea/user/" title="user" icon="mdi-broadcast"></UserMenu-NavbarLink>
                <UserMenu-NavbarLink path="/ea/detail/" title=" Request Test" icon="mdi-crown-outline"></UserMenu-NavbarLink> -->
            </UserMenu-NavMenuGroup> 
            <v-divider></v-divider>
            <!-- <UserMenu-NavbarLink path="/transaction" title="Transaction" icon="mdi-bank-transfer"></UserMenu-NavbarLink> 
            <UserMenu-NavbarLink path="/forex" title="Forex" icon="mdi-finance"></UserMenu-NavbarLink>
            <UserMenu-NavbarGroup title="Pages"></UserMenu-NavbarGroup> 
            <UserMenu-NavMenuGroup icon="mdi-bookmark-multiple-outline" title="Product">
                <UserMenu-NavbarLink path="/semiauto" title="EA" icon="mdi-animation"></UserMenu-NavbarLink>
                <UserMenu-NavbarLink path="/signals" title="Indicator" icon="mdi-broadcast"></UserMenu-NavbarLink>
                <UserMenu-NavbarLink path="/copytrade" title=" Copy Trade" icon="mdi-crown-outline"></UserMenu-NavbarLink>
            </UserMenu-NavMenuGroup> --> 

        </v-list>

        <template v-slot:append>
            <div>
                <div @click="logout()">
                    <UserMenu-NavbarLink path="/logout" title="ออกจากระบบ" icon="em em-door"></UserMenu-NavbarLink>
                </div>

            </div>
        </template>

    </v-navigation-drawer>

</div>
</template>

<script>

import {
    Auth
} from '@/vuexes/auth'
export default {
    data() {
        return {
            isDrawerOpen: true
        }
    },
    methods: {
        async logout() {
            await Auth.logout();
            await location.reload();
        }
    },
    computed: {
        user() {
            return Auth.user
        }
    }
}
</script>

<style>
.upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
}

.bg-navb {
    background: rgb(0, 221, 126);
    background: linear-gradient(90deg, rgba(0, 221, 126, 1) 0%, rgba(0, 255, 217, 1) 100%);
}
</style>
