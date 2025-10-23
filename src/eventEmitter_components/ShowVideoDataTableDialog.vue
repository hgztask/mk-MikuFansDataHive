<script lang="ts">
import {eventEmitter} from "../model/EventEmitter";

export default {
  data() {
    return {
      videoList: [],
      show: false
    }
  },
  methods: {
    handleClose() {
      this.videoList = [];
    }
  },
  created() {
    eventEmitter.on('event:showVideoDataList', (list) => {
      this.videoList = list;
      this.show = true;
    })
  }
}
</script>

<template>
  <div>
    <el-dialog :visible.sync="show" fullscreen @close="handleClose">
      <template #title>收藏夹视频列表</template>
      <div>
        数量:
        <el-tag>{{ videoList.length }}</el-tag>
        <el-table :data="videoList" border stripe>
          <el-table-column label="用户名" prop="name" width="200"/>
          <el-table-column label="标题" prop="title" width="700"/>
          <el-table-column label="时长" prop="originalDuration"/>
          <el-table-column label="弹幕" prop="bulletChat"/>
          <el-table-column label="播放" prop="views"/>
          <el-table-column label="收藏名" prop="favName"/>
          <el-table-column label="收藏Id" prop="favId"/>
          <el-table-column label="封面" width="250">
            <template v-slot="scope">
              <el-image :src="scope.row.imgSrc" fit="cover" style="width: 222px; height: 125px"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>