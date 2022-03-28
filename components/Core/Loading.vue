<template>
<div>
    <v-overlay   z-index="9999" :value="loadX" :opacity="0.9">
      <div class="loading">
        <svg viewBox="0 0 960 300">
          <symbol id="s-text">
            <text text-anchor="middle" x="50%" y="80%">CashBack Admin</text>
          </symbol>

          <g class = "g-ants">
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
          </g>
        </svg>
      </div>
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

<style>
.loading > svg {
  display: block;
  font: 7.5em 'Montserrat';
  width: 960px;
  height: 300px;
  margin: 0 auto;
}
.text-copy {
  fill: none;
  stroke: white;
  stroke-dasharray: 6% 29%;
  stroke-width: 5px;
  stroke-dashoffset: 0%;
  animation: stroke-offset 5.5s infinite linear;
}
.text-copy:nth-child(1){
  stroke: #00D692;
  animation-delay: -1;
}
.text-copy:nth-child(2){
  stroke: #0AA0D8;
  animation-delay: -2s;
}
.text-copy:nth-child(3){
  stroke: #34F5A9;
  animation-delay: -3s;
}
.text-copy:nth-child(4){
  stroke: #007BE9;
  animation-delay: -4s;
}
.text-copy:nth-child(5){
  stroke: #FDB731;
  animation-delay: -5s;
}
@keyframes stroke-offset{
  100% {stroke-dashoffset: -35%;}
}
</style>