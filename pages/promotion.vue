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

            <template v-slot:item.is_active="{ item }">
                <UI-IsActive :active="item.is_active"></UI-IsActive>
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
                        <v-text-field v-model="form.code" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="code" hide-details></v-text-field>
                        <v-text-field v-model="form.created_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="created_at" hide-details></v-text-field>
                        <v-text-field v-model="form.discount" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="discount" hide-details></v-text-field>

                        <v-text-field v-model="form.is_point" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="is_point" hide-details></v-text-field>
                        <v-text-field v-model="form.link_to" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="link_to" hide-details></v-text-field>
                        <v-text-field v-model="form.name" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="name" hide-details></v-text-field>
                        <v-text-field v-model="form.updated_at" class="mt-4" prepend-inner-icon="mdi-account-outline" outlined label="updated_at" hide-details></v-text-field>

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
                text: "code",
                value: "code"
            }, {
                text: "created_at",
                value: "created_at"
            }, {
                text: "discount",
                value: "discount"
            }, {
                text: "id",
                value: "id"
            }, {
                text: "is_active",
                value: "is_active"
            }, {
                text: "is_point",
                value: "is_point"
            }, {
                text: "link_to",
                value: "link_to"
            }, {
                text: "name",
                value: "name"
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
            dialog: false,

        };
    },
    async created() {
        await this.startup();
    },
    methods: {
        async startup() {
            this.items = await Core.getHttp(`/api/webconfig/promotion/?page=${this.page}&search=${this.search}`);
            await this.closeDialog()
        },
        async store() {
            let data = await Core.postHttpAlert(`/api/webconfig/promotion/`, this.form)
            if (data.id) {
                await this.updateImage(data.id)
                await this.startup();
            }
        },
        async updateImage(id) {
            let image = this.$refs.webconfig_promotion_image.files[0]
            if (image) {
                let formData = new FormData()
                formData.append("image", image);
                let update = await Core.putImageHttp(`/api/webconfig/promotion/${id}/`, formData)
            }
        },
        async update() {
            delete this.form.image
            let data = await Core.putHttpAlert(`/api/webconfig/promotion/${this.form.id}/`, this.form)
            await this.startup();
        },
        async deleteData(id) {
            let data = await Core.deleteHttpAlert(`/api/webconfig/promotion/${id}/`)
            await this.startup();
        },
        async openDialog() {
            this.dialog = true;
        },
        async openDialogUpdate(id) {
            this.form = await Core.getHttp(`/api/webconfig/promotion/${id}/`)
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
