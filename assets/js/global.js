import Vue from 'vue'

Date.prototype.toLocaleString = function () {
  // 补0 例如 2018/7/10 14:7:2 补完后为 2018/07/10 14:07:02
  function addZero(num) {
    return num < 10 ? "0" + num : num;
  }

  // 按自定义拼接格式返回
  return this.getFullYear() + "-" + addZero(this.getMonth() + 1) + "-" + addZero(this.getDate()) + " " +
    addZero(this.getHours()) + ":" + addZero(this.getMinutes()) + ":" + addZero(this.getSeconds());
};

let global = {
  install(Vue) {
    Vue.prototype.global = {
      /**
       * 获取指定时间戳（毫秒）的友好时间字符串。
       */
      prettyTime: function (timestamp) {
        if (isNaN(timestamp))
          return "";
        let cur = new Date().getTime();
        let second = (cur - timestamp) / 1000;
        console.log(second)

        if (second < 0) {
          return "显示异常";
        } else if (second <= 1) {
          return "刚刚";
        } else if (second <= 5) {
          return "几秒前";
        } else if (second <= 60) {
          return "1分钟内";
        } else if (second < 60 * 60) {
          return Math.floor(second / 60) + "分钟前";
        } else if (second < 24 * 60 * 60) {
          return Math.floor(second / (60 * 60)) + "小时前";
        } else if (second < 3 * 24 * 60 * 60) {
          return Math.floor(second / (24 * 60 * 60)) + "天前";
        } else {
          return new Date(timestamp).toLocaleString();
        }
      },
      prettyNumber: function (num) {
        let oldVal = num;
        if (oldVal >= 1e8)
          return Number(oldVal / 1e8).toFixed(1) + '亿'
        else if (oldVal >= 1e4)
          return Number(oldVal / 1e4).toFixed(1) + '万'
        else
          return oldVal;
      },
      redirect(url) {
        window.location.href = url;
      },
      removeAll: function (a, b) {
        //因为splice()方法会改变原始数组，所以使用slice()方法克隆数组，保证原始数组不被改变，方便多次运算
        let aa = a.slice();
        let bb = b.slice();
        for (let x in bb) {
          let y = aa.indexOf(bb[x]);
          if (y >= 0) {
            aa.splice(y, 1);
          }
        }
        return aa;
      }
    };
  }
}
Vue.use(global)
