<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="text-3xl font-semibold">
                <v-icon class="mr-4">em em-moneybag</v-icon> Commissiom
            </h2>
            <h2 class="text-3xl font-semibold"> </h2>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog()">
                <v-icon class="mr-2 "> em em-file_folder</v-icon>คอมมิชชั่น
            </v-btn>
        </v-toolbar>
        <v-text-field dense @change="startup()" v-model="search" outlined label="ค้นหา"></v-text-field>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
            <!-- <template v-slot:item.id="{ item,index }">
                {{index+1}}
            </template> -->
            <template v-slot:item.actions="{ item }">

                <v-btn x-small fab class="m-2" @click="openDialogUpdate(item.id)" color="warning">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small fab class="m-2" @click="deleteData(item.id)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
            <template v-slot:item.type_values_master="{ item }">
                <UI-IsChecks text="" :active="!item.type_values_master"></UI-IsChecks>
            </template>
            <template v-slot:item.type_values_child="{ item }">
                <UI-IsChecks text="" :active="!item.type_values_child"></UI-IsChecks>
            </template>
            <template v-slot:item.broker="{ item }">

                <div class="flex items-center p-2">
                    <img class="shadow-xl rounded-lg w-10 h-10 object-cover" :src="$url+item.broker.image"> <span class="ml-2">{{ item.broker.name }}</span>
                </div>
            </template>
            <template v-slot:item.tier="{ item }">
                <span class="font-semibold" :style="`color:${item.tier.color};`">{{item.tier.name}}</span>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <v-icon>em em-moneybag</v-icon>{{(form.id)?"แก้ไข":"เพิ่ม"}}Commissiom
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialog()" text color="error">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="(form.id)?update():store()">
                        <v-select :items="brokers" item-text="name" item-value="id" v-model="form.broker" class="mt-4" prepend-inner-icon="em em-chart" outlined label="โบรกเกอร์" hide-details></v-select>
                        <v-select :items="tiers" item-text="name" item-value="id" v-model="form.tier" class="mt-4" prepend-inner-icon="em em-sports_medal" outlined label="ระดับเทียร์" hide-details></v-select>

                        <v-select :items="['EA','Broker','Indication']" v-model="form.types" class="mt-4" prepend-inner-icon="em em-spiral_note_pad" outlined label="ประเภท" hide-details></v-select>

                        <v-checkbox v-model="form.type_values_master" label="เปอร์เซ็นต์มาสเตอร์"></v-checkbox>
                        <v-text-field v-model="form.master" class="mt-4" prepend-inner-icon="em em-female-technologist" outlined label="มาสเตอร์" hide-details></v-text-field>
                        <v-checkbox v-model="form.type_values_child" label="เปอร์เซ็นต์ผู้ต่อใต้"></v-checkbox>
                        <v-text-field v-model="form.child" class="mt-4" prepend-inner-icon="em em-man-man-girl" outlined label="ผู้ต่อใต้" hide-details></v-text-field>

                        <div class="mt-4 flex">
                            <v-spacer />
                            <v-btn type="submit" color="success">บันทึกข้อมูล</v-btn>
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
                text: "ลำดับ",
                value: "num"
            }, {
                text: "ประเภท",
                value: "types"
            }, {
                text: "โบรกเกอร์",
                value: "broker"
            }, {
                text: "เพอร์มิชชันมาสเตอร์",
                value: "type_values_master"
            }, {
                text: "ค่าคอมมิชชันมาสเตอร์",
                value: "master"
            }, {
                text: "เพอมิชชั่นผู้ต่อใต้",
                value: "type_values_child"
            }, {
                text: "ค่าคอมมิชชันผู้ต่อใต้",
                value: "child"
            }, {
                text: "ระดับเทียร์",
                value: "tier"
            }, {
                text: "วันที่สร้าง",
                value: "created_at"
            }, {
                text: "วันที่อัพเดท",
                value: "updated_at"
            }, {
                text: "การจัดการ",
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
        getTiersById(id) {
            try {
                return _.find(this.tiers, {
                    id: id
                })
            } catch (error) {
                return null
            }
        },
        getBrokerById(id) {
            try {
                return _.find(this.brokers, {
                    id: id
                })
            } catch (error) {
                return null
            }
        },
        async startup() {
            this.items = await Core.getHttp(`/api/commission/admincommision/?page=${this.page}&search=${this.search}`);
            this.items = _.map(this.items, (r,index) => {
                let item = r
                item.num = index+1
                item.broker = this.getBrokerById(item.broker)
                item.tier = this.getTiersById(item.tier)
                return item
            })
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
