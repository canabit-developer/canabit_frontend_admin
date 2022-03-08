<template>
<div class="error">
    <div v-if="error.detail">
        <v-alert dense text type="error" :value="true">
            {{error.detail}}
        </v-alert>
    </div>
    <div v-if="error.password_confirm">
        <v-alert dark dense v-for="(message,i) in error.password_confirm" :key="i" type="error" :value="true">
            Password: {{message}}
        </v-alert>
    </div>

    <div v-if="error.username">
        <v-alert dark dense v-for="(message,i) in error.username" :key="i" type="error" :value="true">
            Username: {{message}}
        </v-alert>
    </div>
    <div v-if="error.email">
        <v-alert dark dense v-for="(message,i) in error.email" :key="i" type="error" :value="true">
            Email: {{message}}
        </v-alert>
    </div>
    <div v-if="error.password" >
        <v-alert dark dense   v-for="(message,i) in error.password" :key="i" type="error" :value="true">
            Password: {{message}}
        </v-alert>
    </div>
    <div v-if="error.phone_number">
        <v-alert dark dense v-for="(message,i) in error.phone_number" :key="i" type="error" :value="true">
            Phone: {{message}}
        </v-alert>
    </div>
</div>
</template>

<script>
export default {
    props: {
        error: {
            default: {}
        }
    }
}
</script>

<style>

</style>
