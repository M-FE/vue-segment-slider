## Vue WeChat PC
[![NPM version](https://img.shields.io/npm/v/vue-segment-slider.svg?style=flat)](https://npmjs.com/package/vue-segment-slider)
[![NPM downloads](https://img.shields.io/npm/dm/vue-segment-slider.svg?style=flat)](https://npmjs.com/package/vue-segment-slider)
> 用于分片段、颜色显示的滑动输入条。

![](http://assets-cdn.99plas.com/packages/slider-demo.png)

## Installation

```javascript
npm install --save vue-segment-slider
# or
yarn add vue-segment-slider
```

## Usage

### demo.vue

```vue
<template>
    <Slider
        :defaultValue="1000"
        :segments="segments"
    />
</template>

<script>
import { Slider } from "vue-segment-slider";

export default {
    data() {
        return {
            segments: {
                success: [0, 9000, 3],
                warning: [-100, 9999, 2],
                error: [-200, 11000, 1]
            }
        };
    },

    components: {
        Slider
    }
};
</script>
```

## Options

- **`defaultValue(v-model): `** `Number`

默认的value值。默认值：`undefined`。

- **`segments: `** `Object|Array`

分段的数据。传入的是对象时，数据格式为 { 'color': [min, max, zIndex] }。传入的是数组时：[{ color: '#000', type: 'success/error/warning', min: 0, max: 10, zIndex: 1 }]。其中type和color优先使用type, zIndex表示显示的层级关系，如果发生重叠，值大的会覆盖值小的。

```javascript
{
    min: 该片段的起始值 - Number
    max: 该片段的结束值 - Number
    type: 片段的类型，优先使用 - String
    color: 片段的背景色 - String
    zIndex: 层级关系 - Number
}
```

- **`min: `** `Number`

渲染轴的最小值，不传入时默认获取segments中最小的值作为最小值。

- **`max: `** `Number`

渲染轴的最大值，不传入时默认获取segments中最大的值作为最大值

- **`types: `** `Object`

类型列表，用于覆盖默认的sucess/error/warning的颜色值。

```javascript
// 默认类型和值
const DEFAULT_TYPES = {
    success: '#7fae1b',
    warning: '#ff8b3a',
    error: '#f34336'
};
```

- **`height: `** `Number`

渲染条的高度。默认值：`10`。

- **`subscriptVisible: `** `Boolean`

是否显示下标。默认值：`true`。

- **`popoverClassname: `** `String|Array|Object`

用于设置气泡的类名。

- **`disabled: `** `Boolean`

是否禁用。默认值：`false`。
