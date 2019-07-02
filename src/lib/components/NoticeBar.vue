<template>
  <div ref="noticeBarContainer" class="notice-bar">
    <div
      class="notice-bar-wrapper"
      :style="{
        'transition-property': 'transform',
        'transform': `translate(0px, ${diff}px)`,
        'transition-timing-function': `${effect}`,
        'transition-duration': `${duration / speed}s`}">
      <p
        v-for="(item, index) in noticeList"
        :key="'notice-bar-item-' + index"
        :style="{
          'transition-property': 'transform',
          'height': `${elHeight}px`,
          'line-height': `${elHeight}px`,
          'transform': `translate(${item.diff}px, 0px)`,
          'transition-timing-function': 'linear',
          'transition-duration': `${itemDuration / rollSpeed}s`
        }"
        class="notice-bar-item"
        :class="['notice-bar-item-' + index, { 'ellipsis': !isRoll }]">
        <span v-if="isHtml" v-html="item.text"></span>
        <span v-else>{{ item.text }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeBar',
  props: {
    text: {
      default: '',
      type: [String, Array],
    },
    delay: {
      default: 2,
      type: Number,
    },
    speed: {
      default: 1,
      type: Number,
    },
    rollSpeed: {
      default: 1,
      type: Number,
    },
    effect: {
      default: 'ease-in-out',
      type: String,
    },
    isRoll: {
      default: false,
      type: Boolean,
    },
    isRollComplete: {
      default: true,
      type: Boolean,
    },
    isHtml: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
      noticeBar: null, // 当前容器
      curEl: null, // 当前 滚动的条目
      elHeight: 0, // 容器高度
      elWidth: 0, // 容器宽度
      diff: 0, // 偏移量
      curIndex: 0, // 当前滚动条目索引
      duration: 0.5, // 容器动画默认运动时间
      itemDuration: 3, // 容器条目动画默认运动时间
      timer: null, // 定时器标识
      noticeList: [], // 广播信息列表
      isItemMoveComplete: false, // item 是否滚动完毕
    }
  },
  computed: {
    isRollItem () {
      return this.isItemMove() && !this.isItemMoveComplete && this.isRoll
    },
  },
  mounted () {
    this.init()
  },
  watch: {
    text: {
      handler (val) {
        const list = typeof val === 'string' ? [val] : val
        this.noticeList = list.map(item => ({
          diff: 0,
          text: item,
        }))
      },
      immediate: true,
    },
  },
  methods: {
    init () {
      this.noticeBar = this.$refs['noticeBarContainer']
      this.elHeight = this.noticeBar.offsetHeight
      this.elWidth = this.noticeBar.offsetWidth
      this._bindEvent()
      this.startMoving()
    },
    _bindEvent () {
      if (!this.noticeBar) return
      this.noticeBar.addEventListener('transitionend', this.transitionHandler)
    },
    isItemMove () {
      if (!this.curEl || !this.noticeBar) return false
      return this.curEl.children[0].offsetWidth > this.elWidth
    },
    run () {
      this.curEl = document.querySelector(`.notice-bar-item-${this.curIndex}`)
      if (this.curIndex < this.noticeList.length) {
        this.isRollItem ? this.itemMove() : this.wrapMove()
      } else {
        this.resetWrapMove()
      }
    },
    transitionHandler (e) {
      e.stopPropagation()
      this.isItemMoveComplete = false
      this.run()
    },
    itemTransitionHandler (e) {
      e.stopPropagation()
      this.isItemMoveComplete = true
      this.run()
    },
    wrapMove () {
      this.duration = 0.5
      this.starTimer(() => {
        this.curIndex++
        this.diff -= this.elHeight
      }, this.isItemMoveComplete && this.isRollComplete ? 100 : this.delay * 1000)
    },
    resetWrapMove () {
      this.duration = 0
      this.curIndex = 0
      this.diff = 0
      this.startMoving()
    },
    itemMove () {
      if (!this.curEl) return
      this.curEl.removeEventListener('transitionend', this.itemTransitionHandler)
      this.curEl.addEventListener('transitionend', this.itemTransitionHandler)
      this.isItemMoveComplete = false
      this.itemDuration = 0
      this.noticeList[this.curIndex].diff = 0
      this.starTimer(() => {
        this.itemDuration = 3
        const itemDiff = this.isRollComplete ? this.curEl.children[0].offsetWidth : this.curEl.children[0].offsetWidth - this.elWidth
        this.noticeList[this.curIndex].diff = -itemDiff
      }, this.delay * 1000)
    },
    startMoving () {
      this.starTimer(() => this.run(), 100)
    },
    starTimer (func, interval) {
      this.clearTimer()
      this.timer = setTimeout(func, interval)
    },
    clearTimer () {
      if (this.timer) clearTimeout(this.timer)
    },
  },
}
</script>

<style lang="scss" scoped>
.notice-bar {
  width: 100%;
  height: 100%;
  overflow: hidden;

  &-item {
    margin: 0;
    padding: 0;
    white-space: nowrap;
    
    &.ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>


