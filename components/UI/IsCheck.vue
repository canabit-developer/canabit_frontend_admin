<template>
<div>
    <!-- <v-chip v-if="active" small class="ma-2" color="green" text-color="white">
        <v-icon>mdi-check</v-icon> {{text}}
    </v-chip> -->
    <v-chip v-if="!active" small  class="ma-2" color="red" text-color="white">
        <v-icon>mdi-close</v-icon> {{text}}
    </v-chip>
    
</div>
</template>

<script>
export default {
    props:{
        active:{
            default:true
        },
        text:{
            default: "Status"
        }
    }
}
</script>

<style>

</style>
