<template>
<v-list-group ref="refVListGroup" class="vertical-nav-menu-group text--primary" dense>
    <template #prependIcon>
        <v-icon :class="{'alternate-icon-small': !icon}">
            {{ icon }}
        </v-icon>
    </template>
    <template #activator>
        <v-list-item-title class="text-gray-400 ">
            {{ title }}
        </v-list-item-title>
    </template> 
    <slot></slot>
</v-list-group>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';
</style>
