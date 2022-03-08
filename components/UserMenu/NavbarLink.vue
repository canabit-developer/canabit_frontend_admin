<template>
<v-list-item   :class="activateBg" :dark="activate" @click="$router.push(`${path}`)">
    <v-list-item-icon >
        <v-icon   >
            {{ icon || alternateIcon }}
        </v-icon>
    </v-list-item-icon> 
    <v-list-item-title :class="activateTxt" >
        {{ title }}
    </v-list-item-title>
</v-list-item>
</template>

<script>
export default {
  
    props: {
        title: {
            type: String,
            default:'text'
        },
        icon: {
            type: String,
            default: undefined,
        },
        path:{
            type:String,
            default:'/'
        }
    },
    computed:{
        activate(){
            return (this.$route.path == this.path)
        },
        activateBg(){ 
            return (this.$route.path == this.path)?`navbar-active shadow-2xl text-white box-shadows`:``
        },
       
       activateTxt(){ 
            return (this.$route.path == this.path)?`text-white `:`light-text `
       }
       
    }

}
</script>

<style  scoped>
   
     .box-shadows{
        box-shadow: 0 5px 10px -4px rgb(94 86 105 / 42%);
    }
</style>