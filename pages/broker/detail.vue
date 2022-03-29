<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <!-- <h2 class="flex text-3xl font-semibold">
                <img class="h-16 w-16" :src="$url+broker.image" alt="">{{broker.name}}
            </h2> -->
            <v-spacer></v-spacer>

        </v-toolbar><br>
        <v-tabs v-model="tabs">
            <v-tab>
                Result
            </v-tab>
            <v-tab-item>
                <div v-if="tabs == 0 && response">
                    <v-select @change="load()" item-text="name" item-value="id" :items="brokers" v-model="chooseBroker" label="Broker"></v-select>

                    <v-data-table :headers="resHeaders" :items="data" class="elevation-1">
                        <template v-slot:item.point_cashback="{ item }">
                            <div>
                                <span class="text-green-600 font-semibold">+ {{item.point_cashback}}</span>
                            </div>
                        </template>
                        <template v-slot:item.partners="{ item }">
                            <div v-for="partner,index in item.partners" :key="index">
                                <h2>{{partner.first_name}} {{partner.last_name}} <span class="text-green-600 font-semibold">+ {{partner.point_cashback}}</span> ({{partner.partner_val}}) </h2>

                            </div>
                        </template>
                    </v-data-table>

                </div>

            </v-tab-item>
            <v-tab>
                Raw Data
            </v-tab>
            <v-tab-item>
                <div v-if="tabs == 1">
                    <vue-excel-editor width="100%" v-model="raw">
                    </vue-excel-editor>
                </div>
            </v-tab-item>

        </v-tabs>

        <!-- <vue-excel-editor width="100%" v-model="raw"> 
        </vue-excel-editor> -->

        <!-- <div class="flex">
            <div class="w-1/2">
                <pre>{{tiers}}</pre>
            </div>
            <div class="w-1/2">
                <pre>{{data}}</pre>
            </div>
        </div> -->

    </div>
</div>
</template>

<script>
import {
    Core
} from "@/vuexes/core";
import {
    Web
} from '@/vuexes/web'
import {
    Cash
} from '@/vuexes/cash'
import {
    generateCodeFrame
} from 'vue-template-compiler';
export default {
    components: {},
    data() {
        return ({
            tabs: 0,
            broker: {},
            raw: [],
            rawData: [],
            commissions: [],
            data: [],
            tiers: Cash.tiers,
            chooseBroker: 0,
            resHeaders: [{
                    text: "User",
                    value: "user"
                }, {
                    text: "Tier",
                    value: "tier_name"
                }, {
                    text: "Broker",
                    value: "broker"
                }, {
                    text: "Account Type",
                    value: "client_account_type"
                }, {
                    text: "Lots",
                    value: "volume_lots"
                }, {
                    text: "Reward usd",
                    value: "reward_usd"
                }, {
                    text: "คำนวณเปอร์เซ็น",
                    value: "master_percent"
                },
                {
                    text: "ค่าที่บันทึกไว้",
                    value: "master_value"
                },
                {
                    text: "CashBack Point",
                    value: "point_cashback"
                },
                {
                    text: "Partner",
                    value: "partners"
                },
            ],
            response:false,
        })
    },
    async created() {
       
        await this.load();
        this.response = true

    },
    methods: {
        async load() {
            await Web.switchLoad(true)
            if (this.$route.query.id) {
                this.broker = await Core.getHttp(`/api/adminfinanace/broker/${this.$route.query.id}/`)
                this.raw = JSON.parse(this.broker.raw_data)
                this.rawData = _.filter(this.broker.data, {
                        broker: this.chooseBroker
                    })

                this.commissions = await Core.getHttp(`/api/commission/admincommision/?types=Broker`)
                await this.generateData()
            }
            await Web.switchLoad(false)
        },

        async getMyPartner() {

        },

        async generateData() {
            this.data = await _.map(this.rawData, (r) => {
                let obj = {}
                let myTier = _.find(this.tiers, (d) => {
                    return (d.id == r.tier)
                })
                let myCommission = _.find(this.commissions, {
                    tier: r.tier,
                    broker: this.chooseBroker
                })
                let broker = _.find(this.brokers, {
                    id: r.broker
                })
                obj['user'] = r.user
                obj['tier_name'] = (myTier) ? myTier.name : '-'
                obj['broker'] = (broker) ? broker.name : '-'
                obj['client_account_type'] = r.client_account_type
                obj['volume_lots'] = r.volume_lots
                obj['reward_usd'] = r.reward_usd
                if (myCommission) {
                    obj['master_percent'] = myCommission.type_values_master
                    obj['master_value'] = myCommission.master
                    obj['point_cashback'] = this.calculatePointMaster(myCommission, r.volume_lots, r.reward_usd)
                    obj['partners'] = _.map(r.partners, (ri) => {
                        let objIn = ri
                        objIn['partner_val'] = myCommission.child
                        objIn['point_cashback'] = this.calculatePointChild(myCommission, r.volume_lots, r.reward_usd)
                        return objIn
                    })

                }

                return obj
            })
        },

        calculatePointMaster(commission, volume_lots, reward_usd) {
            let result = 0
            if (commission.type_values_master == true) {
                let per = (commission.master) / 100
                result = per * (volume_lots * reward_usd)
            } else {
                result = commission.master * (volume_lots * reward_usd)
            }
            return result
        },
        calculatePointChild(commission, volume_lots, reward_usd) {
            let result = 0
            if (commission.type_values_child == true) {
                let per = (commission.child) / 100
                result = per * (volume_lots * reward_usd)
            } else {
                result = commission.child * (volume_lots * reward_usd)
            }
            return result
        }
    },
    computed: {
        brokers: () => {
            return Cash.brokers
        },

    }
}
</script>

<style>

</style>
