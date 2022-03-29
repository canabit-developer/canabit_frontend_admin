import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import axios from '@/plugins/axios'
import _ from "lodash"

import { Web } from './web'
import { Core } from './core'

@Module({ generateMutationSetters: true })
class CashModule extends VuexModule {

    brokers:any = []
    tiers:any = []
    setting:any = {}



    public async getEnv(){
        await this.getBrokers();
        await this.getTiers();
        await this.getSetting();
    }


    private async getBrokers(){
        this.brokers = await Core.getHttp(`/api/finance/broker/?is_active=true`)
    }

    private async getTiers(){
        this.tiers = await Core.getHttp(`/api/account/tier/?is_active=true`)
    }

    private async getSetting(){
        let def = {"point_to_us":1,"us_to_bath":33.24,type:'local'}
        let data = await Core.getHttp(`/api/webconfig/setting/`)
        this.setting = (data[data.length - 1])?JSON.parse(data[data.length-1].value): def
    }

}

import store from "@/vuexes"
import moment from "moment";
export const Cash = new CashModule({ store, name: "Cash" })