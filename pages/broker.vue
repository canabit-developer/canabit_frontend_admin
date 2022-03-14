<template>
<div v-if='response'>
    <v-text-field name="name" label="label" id="id" v-model="search"></v-text-field>
    <v-btn @click="startup()" color="success">Search</v-btn>
    <v-select :items="isActiveLists" item-text="txt" item-value="value" v-model="isActive" @change="startup()" label="label"></v-select>
    <v-data-table :headers="headers" :items="items" class="elevation-1"></v-data-table>

    <v-pagination :length="items.count/2" v-model="page"></v-pagination>
</div>
</template>

<script>
import {
    Core
} from '@/vuexes/core'
import {
    Auth
} from '@/vuexes/auth'
export default {
    data() {
        return ({
            response: false,
            items: [],
            headers: [],
            page: 1,
            search: '',
            isActiveLists: [{
                    txt: 'ทั้งหมด',
                    value: ''
                },
                {
                    txt: 'ใช้งานอยู่',
                    value: '&is_active=true'
                },
                {
                    txt: 'ปิดการใช้งาน',
                    value: '&is_active=false'
                },
            ],
            isActive: ''
        })
    },
    async created() {
        await this.startup();
        this.response = true;
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/finance/broker/?search=${this.search}${this.isActive}`)
            if (this.items.length > 0) {
                this.headers = _.map(Object.keys(this.items[0]), (r) => {
                    return {
                        text: r,
                        value: r
                    }
                })
            }
        }
    },
    computed: {

    },
    watch: {
        async page(oldVal, newVal) {
            await this.startup();
        }
    }
}
</script>

<style>

</style>
