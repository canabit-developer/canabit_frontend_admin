<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold"> </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">Add Data</v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

        </v-data-table>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    {{(form.id)?"Update":"Create"}} Data
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">
                        <v-select :items="brokers" item-text="name" item-value="id" v-model="form.broker" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="broker_id" hide-details></v-select>
                        <v-select :items="tiers" item-text="name" item-value="id" v-model="form.tier" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="tier_id" hide-details></v-select>

                        <v-select :items="['EA','Broker','Indication']" v-model="form.types" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="types" hide-details></v-select>

                        <v-checkbox v-model="form.type_values_master" label="Master %"></v-checkbox>
                        <v-text-field v-model="form.master" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="master" hide-details></v-text-field>
                        <v-checkbox v-model="form.type_values_child" label="Child %"></v-checkbox>
                        <v-text-field v-model="form.child" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="child" hide-details></v-text-field>

                        <div class="mt-4 flex">
                            <v-spacer />
                            <v-btn type="submit" color="success">Submit</v-btn>
                        </div>
                    </form>
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>
</div>
</template>

<script>
import {
    Core
} from "@/vuexes/core";
import {
    Cash
} from "@/vuexes/cash";
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                text: "id",
                value: "id"
            }, {
                text: "types",
                value: "types"
            }, {
                text: "type_values_master",
                value: "type_values_master"
            }, {
                text: "master",
                value: "master"
            }, {
                text: "type_values_child",
                value: "type_values_child"
            }, {
                text: "child",
                value: "child"
            }, {
                text: "created_at",
                value: "created_at"
            }, {
                text: "updated_at",
                value: "updated_at"
            }, {
                text: "broker",
                value: "broker"
            }, {
                text: "tier",
                value: "tier"
            }, {
                text: "Action",
                value: "actions"
            }],
            page: 1,
            maxPage: 3,
            search: "",
            form: {},
            dialog: false,

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/commission/admincommision/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/commission/admincommision/`, this.form)
            if (data.id) {
               // await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.admincommission_commission_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/commission/admincommision/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/commission/admincommision/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/commission/admincommision/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/commission/admincommision/${id}/`)
            this.dialog = true;
        },
        async closeDialog() {
            this.form = {};
            this.dialog = false;
        },

    },
    watch: {
        async page(newVal, oldVal) {
            await this.startup();
        }
    },
    computed: {
        brokers: () => {
            return Cash.brokers
        },
        tiers: () => {
            return Cash.tiers
        }
    }
};
</script>

<style>
</style>
