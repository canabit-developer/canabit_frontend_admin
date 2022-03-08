<template>
<div>
 
    <v-overlay z-index="9999" :value="loadX">
        <v-btn style="height:158px; width:158px;" color="white" fab class=" animate__animated animate__pulse animate__infinite	infinite">
            <img class="w-auto  h-20  " src="@/static/images/logos/canabit_a.jpg" alt="">
        </v-btn>
     <center>   <h2 class="text-xl ">{{loadTxt}} </h2></center>
    </v-overlay>
</div>
</template>

<script lang="ts">
import { 
    Web
} from "@/vuexes/web";
import {
    Component,
    Vue,
    Watch
} from "nuxt-property-decorator";
@Component({
    components: {},
    computed: {}
})
export default class loading extends Vue {
    overlay: any = true
    async created() {}
 
    get loadX() { 
        return Web.loading   
    }
    get loadTxt() {
        return Web.loadTxt
    }
}
</script>
