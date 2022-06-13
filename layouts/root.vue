<template>
<div>
    <v-app>
        <Core-Notification />
        <Core-Loading></Core-Loading>
        <div class="auth-wrapper auth-v1">
            <div class="auth-inner">
                <Nuxt />
            </div>

            <!-- background triangle shape  -->
            <img class="auth-mask-bg" height="173" src="~/static/images/misc/mask-light.png">

            <!-- tree -->
            <img class="auth-tree" width="247" height="185" src="~/static/images/misc/tree.png">

            <!-- tree  -->
            <img class="auth-tree-3" width="377" height="289" src="~/static/images/misc/tree-3.png">
        </div>
    </v-app>

</div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai&display=swap');
*{
   font-family: 'IBM Plex Sans Thai', sans-serif!important;
} 
</style>