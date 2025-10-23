<script lang="ts">
import personalFav from "../pagesModel/personalFav";
import {eventEmitter} from "../model/EventEmitter";
import defUtil from "../utils/defUtil";
import favCommon from "../pagesModel/favCommon";

export default {
  data() {
    return {
      appendModeV: false,
      videoList: []
    }
  },
  methods: {
    addTo(list) {
      for (let data of list) {
        if (this.videoList.some((item) => item.bv === data.bv)) {
          continue;
        }
        this.videoList.push(data);
      }
    },
    getCurrentDataListBut() {
      const itemActive = favCommon.getLeftSidebarItemActive();
      if (itemActive === null || ['话题收藏', '图文收藏夹', '课程收藏夹'].includes(itemActive)) {
        this.$message.warning('请选择视频类收藏夹');
        return
      }
      const loading = this.$loading({text: '获取当前页中，尽量不要进行任何操作'});
      personalFav.getVideoDataList().then(list => {
        loading.close();
        console.log('当前页收藏视频列表数据', list)
        if (this.appendModeV) {
          this.addTo(list);
        } else {
          this.videoList = list;
        }
        this.$alert('已获取当前页收藏视频列表数据，共' + list.length + '个');
      })
    },
    async getCurrenFavAllPageDataListBut() {
      const itemActive = favCommon.getLeftSidebarItemActive();
      if (itemActive === null || ['话题收藏', '图文收藏夹', '课程收藏夹'].includes(itemActive)) {
        this.$message.warning('请选择视频类收藏夹');
        return
      }
      const loading = this.$loading({text: '获取中，尽量不要进行任何操作'});
      const favName = await personalFav.getCurrentFavName();
      const list = await personalFav.getCurrenFavAllPageDataList();
      console.log(`当前${favName}收藏夹所有页数据`, list);
      if (this.appendModeV) {
        this.addTo(list);
      } else {
        this.videoList = list;
      }
      loading.close();
      await this.$alert(`已获取${favName}收藏夹所有页数据，共${list.length}个，可在面板中选择导出`, {type: 'success'})
    },
    lookDataBut() {
      const tempList = this.videoList;
      if (tempList.length === 0) return;
      eventEmitter.send('event:showVideoDataList', tempList);
    },
    clearDataListBut() {
      this.videoList = [];
    },
    printConsoleBut() {
      if (this.videoList.length === 0) {
        this.$message.warning('请先获取收藏夹视频列表数据');
        return
      }
      console.log(JSON.parse(JSON.stringify(this.videoList)));
      this.$notify({message: '已打印到控制台'});
    },
    outToFileBut() {
      if (this.videoList.length === 0) {
        this.$message.warning('请先获取收藏夹视频列表数据');
        return
      }
      personalFav.getCurrentFavName().then(favName => {
        const filename = favName + '收藏夹视频列表.json';
        defUtil.fileDownload(JSON.stringify(this.videoList), filename)
        this.$notify({message: `${filename}已导出，需按需保存到本地.`})
      })
    }
  }
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>收藏夹数据获取</template>
      <el-switch v-model="appendModeV" active-text="追加模式"/>
      <el-divider/>
      <el-button @click="getCurrentDataListBut">获取视频列表(当前页)</el-button>
      <el-button @click="getCurrenFavAllPageDataListBut">获取所有页(当前收藏夹)</el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>导出</template>
      <el-button @click="printConsoleBut">打印到控制台</el-button>
      <el-button @click="outToFileBut">导出文件</el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>当前数据量</template>
      <el-tag>{{ videoList.length }}</el-tag>
      <el-divider/>
      <el-button @click="clearDataListBut">清除登记数据</el-button>
      <el-button @click="lookDataBut">查看数据</el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>说明</template>
      <div>数据是去重的，即相同bv的视频只记录一次</div>
      <div>勾选追加模式时，可追加数据, 否则记录数据量将覆盖</div>
    </el-card>
  </div>
</template>