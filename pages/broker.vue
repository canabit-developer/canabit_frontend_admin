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
        <v-data-table :headers="headers" :items="items.results" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
            <template v-slot:item.image="{ item }">
                <div class="p-4"><img :src="item.image" class="w-20 h-auto shadow-xl" /></div>
            </template>
            <template v-slot:item.is_active="{ item }">
                <UI-IsActive :active="item.is_active"></UI-IsActive>
            </template>
        </v-data-table>
        <v-pagination v-model="page" :length="items.count/maxPage"></v-pagination>

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

                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="name" hide-details></v-text-field>
                        <v-select multiple v-model="form.types" :items="accountTypes" item-text="name" item-value="id" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="Broker" hide-details></v-select>

                        <br><br><span>image</span><input ref="finance_broker_image" type="file"><br><br>

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
export default {
    data: () => {
        return {
            items: [],
            headers: [{
                text: "id",
                value: "id"
            }, {
                text: "name",
                value: "name"
            }, {
                text: "image",
                value: "image"
            }, {
                text: "is_active",
                value: "is_active"
            }, {
                text: "created_at",
                value: "created_at"
            }, {
                text: "updated_at",
                value: "updated_at"
            }, {
                text: "Action",
                value: "actions"
            }],
            page: 1,
            maxPage: 3,
            search: "",
            form: {},
            accountTypes: [],
            dialog: false,

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {

            this.items = await Core.getHttp(`/api/adminfinanace/broker/?page=${this.page}&search=${this.search}`);
            this.accountTypes = await Core.getHttp(`/api/finance/accounttype/`)
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/adminfinanace/broker/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.finance_broker_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/adminfinanace/broker/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/adminfinanace/broker/${this.form.id}/`, this.form)
            await this.updateImage(data.id)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/adminfinanace/broker/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/adminfinanace/broker/${id}/`)
            this.dialog = true;
        },
        async closeDialog() {
            this.form = {};
            this.dialog = false;
        }
    },
    watch: {
        async page(newVal, oldVal) {
            await this.startup();
        }
    },
};
</script>

<style>
</style>
