<template>
<div>

    <v-chip small v-if="status == 0" class="ma-2"   color="warning" text-color="white" >
        Pending
    </v-chip>
    <v-chip small v-if="status == 1" class="ma-2"   color="success" text-color="white" >
        Success
    </v-chip>
    <v-chip small v-if="status == 2" class="ma-2"   color="red" text-color="white" >
        Cancel
    </v-chip>
</div>
</template>

<script>
export default {
    props: {
        status: {
            default: 0
        }
    }
}
</script>

<style>

</style>
