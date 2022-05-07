<template>
    <div>
        {{i}}
    </div>
</template>
<script>
export default {
    name: '',
    data(){
        return ({
            i:0,
            text:'Hello'
        })},
    methods:{
        async startup(){
            alert("Hello")
        },
        async setData(num){
            this.i += num
        }
    }
};
</script>