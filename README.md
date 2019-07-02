# vue-simple-noticebar

<a href="https://www.npmjs.com/package/vue-simple-noticebar"><img src="https://img.shields.io/npm/v/vue-simple-noticebar.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/vue-simple-noticebar"><img src="https://img.shields.io/npm/l/vue-simple-noticebar.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vue-simple-noticebar"><img src="https://img.shields.io/npm/dm/vue-simple-noticebar.svg" alt="Downloads"></a>

A simple noticebar component for vue application.

## 安装

```
yarn add vue-simple-noticebar
```

## 使用

```
import Vue from 'vue'
import NoticeBar from 'vue-simple-noticebar'

Vue.use(NoticeBar)

<NoticeBar :text="list" />

```

## 属性

- text: 通知栏需要滚动播放的信息列表 支持传入数组或字符串
- delay: 垂直滚动播放动画延迟时间 默认 2s
- speed: 垂直滚动播放动画速度 默认 1 值越大 速度越快
- rollSpeed: 水平滚动播放动画速度 默认 1 值越大 速度越快
- effect: 垂直滚动播放动画效果 默认 ease-in-out
- isRoll: 是否开启文字内容超过宽度执行水平滚动 默认 false
- isRollComplete: 当且开启 isRoll 时有效，超出宽度是否全滚动 默认 true
- isHtml: 是否以html形式插入信息 主要用于支持自定义样式 默认 false

## Demo

[https://github.com/Chance722/vue-simple-noticebar](https://github.com/Chance722/vue-simple-noticebar)