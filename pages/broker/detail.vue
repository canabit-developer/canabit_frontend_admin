<template>
<div>
    <Bg-User></Bg-User>
    <div class="relative">
        <v-toolbar flat color="transparent">
            <h2 class="flex text-3xl font-semibold">
                <img class="h-16 w-16" :src="$url+broker.image" alt="">{{broker.name}}
            </h2>
            <v-spacer></v-spacer>

        </v-toolbar><br>
        <vue-excel-editor width="100%" v-model="tests">

        </vue-excel-editor>

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
export default {
    components: {},
    data() {
        return ({
            broker: {},
            jsondata: [{
                    user: "hc",
                    name: "Harry Cole",
                    phone: "1-415-2345678",
                    gender: "M",
                    age: 25,
                    birth: "1997-07-01",
                },
                {
                    user: "sm",
                    name: "Simon Minolta",
                    phone: "1-123-7675682",
                    gender: "M",
                    age: 20,
                    birth: "1999-11-12",
                },
                {
                    user: "ra",
                    name: "Raymond Atom",
                    phone: "1-456-9981212",
                    gender: "M",
                    age: 19,
                    birth: "2000-06-11",
                },
                {
                    user: "ag",
                    name: "Mary George",
                    phone: "1-556-1245684",
                    gender: "F",
                    age: 22,
                    birth: "2002-08-01",
                },
                {
                    user: "kl",
                    name: "Kenny Linus",
                    phone: "1-891-2345685",
                    gender: "M",
                    age: 29,
                    birth: "1990-09-01",
                },
            ],
            tests: []
        })
    },
    async created() {
        await Web.switchLoad(true)
        await this.load();
        await Web.switchLoad(false)
    },
    methods: {
        async load() {

            this.broker = await Core.getHttp(`/api/finance/broker/${this.$route.query.id}/`)
            this.tests = JSON.parse(this.broker.raw_data)
        }
    }
}
</script>

<style>

</style>
