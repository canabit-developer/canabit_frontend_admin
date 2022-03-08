<template>
  <div>
    <vs-button floating @click="dialogFile = true" color="success">Upload Picture</vs-button>

    <v-dialog v-if="dialogFile"
      v-model="dialogFile"
      scrollable
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title> Setting Image 
          <v-spacer></v-spacer>
          <vs-button  floating  @click="callbackImage()" color="success">Success Image</vs-button>        </v-card-title>
        <v-card-text>
          <picture-input
          v-if="step == 1"
          ref="pictureInput"
          @change="changeImage"
          width="600"
          height="600"
          margin="16"
          accept="image/jpeg,image/png"
          size="10"
          :removable="true"
          :customStrings="{
            upload: '<h1>Bummer!</h1>',
            drag: 'Drag a 😺 GIF or GTFO',
          }"
        >
        </picture-input>

        <div v-if="step == 2">
          <div v-html="canvas"></div>
          <cropper
            class="cropper"
            :src="image"
            :stencil-props="{
              aspectRatio: 10 / 12,
            }"
            @change="ready"
          ></cropper>
        </div>
        </v-card-text>
        
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PictureInput from "vue-picture-input";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import {
    Core
} from '~/vuexes/core'
export default {
  components: {
    PictureInput,
    Cropper,
  },
  data() {
    return {
      dialogFile: false,
      image: "",
      step: 1,
      canvas: {},
      data: {},
      file: {},
    };
  },
  methods: {
    async changeImage(val) {
      console.log(this.$refs.pictureInput.file);
      this.image = val;
      this.step = 2;
    },
    change({ coordinates, canvas }) {
      console.log(coordinates, canvas);
      this.canvas = coordinates;
    },
    async ready(val) {
      console.log(val);
      let canvas = val.canvas;
      var url = canvas.toDataURL(); 
      this.file = await Core.dataURLtoFile(url);
      console.log(this.file );
    }, 

    async callbackImage(){
      this.step = 1
      this.dialogFile = false;
      await this.$emit('profileImage',this.file)
    }
  },
};
</script>

<style>
</style>
