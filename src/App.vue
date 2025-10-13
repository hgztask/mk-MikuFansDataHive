<script>
import {eventEmitter} from "./model/EventEmitter.js";
import ShowVideoDataTableDialog from "./eventEmitter_components/ShowVideoDataTableDialog.vue";
import VideoTabView from "./views/VideoTabView.vue";
import GraphicFavTabView from "./views/GraphicFavTabView.vue";
import AboutAndFeedbackView from "./views/AboutAndFeedbackView.vue";
import ShowImgDialog from "./eventEmitter_components/ShowImgDialog.vue";
import {getDrawerShortcutKeyGm} from "./data/localMKData.js";
import PanelSettingsView from "./views/PanelSettingsView.vue";
import DonateLayoutView from "./views/DonateLayoutView.vue";

/**
 * Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。
 */
export default {
  components: {
    ShowImgDialog, GraphicFavTabView, ShowVideoDataTableDialog, VideoTabView, AboutAndFeedbackView,
    PanelSettingsView, DonateLayoutView
  },
  data() {
    return {
      drawer: false
    }
  },
  created() {
    eventEmitter.on('主面板开关', () => {
      this.drawer = !this.drawer;
    })
    document.addEventListener('keydown', (event) => {
      eventEmitter.emit('event-keydownEvent', event);
      if (event.key === getDrawerShortcutKeyGm()) {
        this.drawer = !this.drawer;
      }
    });
  }
}
</script>
<template>
  <div>
    <el-drawer :modal="false"
               :visible.sync="drawer"
               direction="rtl"
               size="25%"
               style="position: fixed"
               title="b站数据采集">
      <el-tabs tab-position="left" type="border-card">
        <el-tab-pane label="视频收藏夹" lazy>
          <VideoTabView/>
        </el-tab-pane>
        <el-tab-pane label="图文收藏夹" lazy>
          <GraphicFavTabView/>
        </el-tab-pane>
        <el-tab-pane label="面板设置" lazy>
          <PanelSettingsView/>
        </el-tab-pane>
        <el-tab-pane label="关于与反馈" lazy>
          <AboutAndFeedbackView/>
          <DonateLayoutView/>
        </el-tab-pane>
      </el-tabs>
      {{ keyArr }}
    </el-drawer>
    <ShowVideoDataTableDialog/>
    <ShowImgDialog/>
  </div>
</template>
