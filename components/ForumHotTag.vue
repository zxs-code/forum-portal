<template>
  <el-card style="width: 340px;display: inline-block">
    <div slot="header">
      <span>热门标签</span>
    </div>
    <div id="wordCloud" style="height: 300px; width: 300px;"></div>
  </el-card>

</template>

<script>
  import * as echarts from 'echarts';

  export default {
    data() {
      return {
        hotTags: [
          {value: '30', name: '热门一'},
          {value: '29', name: '热门二'},
          {value: '28', name: '热门三'},
          {value: '27', name: '热门三'},
          {value: '26', name: '热门三'},
          {value: '25', name: '热门三'},
          {value: '24', name: '热门三'},
          {value: '23', name: '热门三'},
          {value: '22', name: '热门三'},
          {value: '21', name: '热门三'},
          {value: '20', name: '热门三'},
          {value: '16', name: '热门三'},
          {value: '15', name: '热门三'},
          {value: '14', name: '热门三'},
          {value: '13', name: '热门三'},
          {value: '12', name: '热门三'},
          {value: '11', name: '热门三'},
          {value: '10', name: '热门三'},
          {value: '9', name: '热门三'},
        ]
      }
    },
    mounted: function () {
      this.loadTag();
    },
    methods: {
      async loadTag() {
        await this.$axios.get('tag/hot')
          .then((res) => {
            if (res.data.code === 0) {
              this.hotTags = res.data.data;
              this.initChart();
            }
          })
      },
      initChart() {
        var myChart = echarts.init(document.getElementById('wordCloud'));
        const option = {
          title: {
            text: '',
            x: "center"
          },
          backgroundColor: "#fff",
          // tooltip: {
          //   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
          // },
          series: [
            {
              type: "wordCloud",
              //用来调整词之间的距离
              gridSize: 10,
              //用来调整字的大小范围
              // Text size range which the value in data will be mapped to.
              // Default to have minimum 12px and maximum 60px size.
              sizeRange: [14, 40],
              // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
              //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
              // rotationRange: [-45, 0, 45, 90],
              // rotationRange: [ 0,90],
              rotationRange: [0, 0],
              //随机生成字体颜色
              // maskImage: maskImage,
              textStyle: {
                color: function () {
                  return (
                    "rgb(" +
                    Math.round(Math.random() * 255) +
                    ", " +
                    Math.round(Math.random() * 255) +
                    ", " +
                    Math.round(Math.random() * 255) +
                    ")"
                  );
                }
              },
              //位置相关设置
              // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
              // Default to be put in the center and has 75% x 80% size.
              left: "center",
              top: "center",
              right: null,
              bottom: null,
              width: "100%",
              height: "100%",
              //数据
              data: this.hotTags
            }
          ]
        };
        myChart.setOption(option);
        // 点击某个字
        myChart.on('click', function (params) {
          console.log('myChart----click---:', params, '------', params.data)
        });
      },
    }

  }

</script>
<style lang='less' scoped>

</style>
