<template>
<div v-if="response">
    <div id="chart" v-if="data"> 
        <highcharts :options="chartOptions" :highcharts="hcInstance"></highcharts>
        <!-- <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart> -->

    </div>
</div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import {
    Chart
} from 'highcharts-vue'
import Highcharts from 'highcharts'

export default {
    components: {
        apexchart: VueApexCharts,
        highcharts: Chart
    },
    data: () => {
        return ({
            hcInstance: Highcharts,
            series: [],
            chartOptions: {

            },
            response: false
        })
    },
    props: {
        data: {
            default: null
        }
    },
    async created() {
        await this.startup();
        this.response = true
    },
    methods: {
        async startup() {
            // this.series = this.data.series 
            this.chartOptions = {
                "type": "column",
                series: this.data.series,

                xAxis: {
                    categories: this.data.categories,
                },
                chartData: this.data.chartData,
                "showInLegend": this.data.showInLegend, 
                "title": "Monthly Gain(Change)",
                plotOptions: {
                    series: {
                        pointWidth: 60,
                        colorByPoint: true,
                        dataLabels: {
                            format: '{point.y} %',
                            enabled: true,
                            align: 'right',
                            color: '#FFFFFF',
                            x: -5,
                            y: 3,
                            style: {
                                fontSize: "16px",
                                color: '#fff',
                                fontWeight: '500',
                            }
                        }
                    }
                },

            }
        }
    }
}
</script>

<style>

</style>
