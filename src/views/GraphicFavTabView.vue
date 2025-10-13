<script>
import graphicFav from "../pagesModel/graphicFav.js";
import defUtil from "../utils/defUtil.js";
import favCommon from "../pagesModel/favCommon.js";

export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    getDataListBut() {
      const itemActive = favCommon.getLeftSidebarItemActive();
      if (itemActive === null || '图文收藏夹' !== itemActive) {
        this.$message.warning('请选择图文收藏夹');
        return
      }
      const loading = this.$loading({text: '获取中，尽量不要进行任何操作'});
      graphicFav.getDataList().then(list => {
        loading.close();
        console.log(list);
        this.list = list;
      })
    },
    outToConsoleBut() {
      const tempList = this.list;
      if (tempList.length === 0) return;
      console.log('当前图文收藏夹数据', JSON.parse(JSON.stringify(tempList)))
    },
    outToFIleBut() {
      const tempList = this.list;
      if (tempList.length === 0) return;
      defUtil.fileDownload(JSON.stringify(tempList), '图文收藏夹数据.json');
      this.$alert('已导出，需按需保存到本地')
    }
  }
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>图文数据获取</template>
      <el-button @click="getDataListBut">获取</el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>导出</template>
      <el-button @click="outToConsoleBut">导出控制台</el-button>
      <el-button @click="outToFIleBut">导出文件</el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>数据量</template>
      <el-tag>{{ list.length }}</el-tag>
    </el-card>
  </div>
</template>