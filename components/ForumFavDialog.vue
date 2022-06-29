<template>
  <div class="fav-box">
    <el-dialog
      width="420px"
      title="添加到收藏夹"
      :visible.sync="favVisible"
      @open="handleOpen"
      :before-close="handleClose"
      center>

      <el-card shadow="never">
        <el-checkbox-group v-model="newSelected">
          <div v-for="(item,i) in favorites" class="fav">
            <el-checkbox :key="i" :label="item.id" style="width: 100%;padding: 12px 0"
                         :disabled="(item.total >= item.maxTotal) && !isChecked(item)"
                         @change="handleChange($event,item)">
              <div class="fav-label">
                <div class="fav-name">
                  {{item.name}}
                </div>
                <div class="fav-limit">
                  {{item.total}}/{{item.maxTotal}}
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <el-input
          type="text"
          class="new-fav-input"
          placeholder="新建收藏夹"
          v-model="newFavName"
          maxlength="16"
          show-word-limit>
          <el-button slot="append" @click="handleCreateFav">新建</el-button>
        </el-input>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      favorites: {
        type: Array,
        default: () => [],
      },
      selected: {
        type: Array,
        default: () => [],
      },
      favVisible: {
        type: Boolean,
        default: false
      },
      submit: Function,
      createFav: Function
    },
    data() {
      return {
        newSelected: null,
        newFavName: null,
      }
    },
    methods: {
      //收藏框打开
      handleOpen() {
        this.newSelected = Array.from(this.selected);
      },
      //收藏框关闭
      handleClose(done) {
        // done();
        this.$emit('update:favVisible', false);
      },
      handleChange(checked, item) {
        item.total += checked ? 1 : -1;
      },
      isChecked(item) {
        // console.log(this.$refs[`checkbox_${item.id}`])
        // console.log(this.selected.includes(item.id));
        return this.selected.includes(item.id);
      },
      //提交请求
      submitForm() {
        let success = this.submit(this.newSelected);
        if (success)
          this.handleClose();
      },
      handleCreateFav() {
        let success = this.createFav(this.newFavName)
        if (success)
          this.newFavName = null
      }
    }
  }
</script>

<style lang="scss">
  .fav-box {
    .el-card {
      border: 0;
      height: 270px;
      overflow: auto;
    }

    .el-dialog__body {
      position: relative;
      padding-top: 10px;
      padding-bottom: 50px;
      margin-bottom: 5px;
    }

    .new-fav-input {
      position: absolute;
      bottom: 0px;
      width: 370px;
    }

    .fav-label {
      width: 320px;
      display: flex;
      justify-content: space-between;

      .fav-name {
        display: inline-block;
        color: #303133;
        font-size: 15px
      }

      .fav-limit {
        display: inline-block;
        color: #999999;
        font-size: 12px
      }
    }

    .el-card__body {
      padding: 0;
    }

    .fav {
      /*margin: 20px 0;*/
    }

    .el-dialog__body {
      padding-right: 0;
    }

  }
</style>
