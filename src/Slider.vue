<script>
import { DEFAULT_TYPES } from './config';

export default {
    name: 'SegmentSilder',

    model: {
        prop: 'defaultValue',
        event: 'change'
    },

    props: {
        defaultValue: {
            type: Number,
            default: undefined
        },
        /**
         * 传入的是对象时，数据格式为 { 'color': [min, max, zIndex] }
         *
         * 传入的是数组时：[{ color: '#000', type: 'success/error/warning', min: 0, max: 10, zIndex: 1 }]
         * 其中type和color优先获取type, zIndex表示显示的层级关系，如果发生重叠，值大的会覆盖值小的
         *
         * 不管传入的是对象还是数组都会格式化成数组的格式
         */
        segments: {
            type: [Object, Array],
            default () {
                return {};
            }
        },
        /**
         * 渲染轴的最小值，不传入时默认获取segments中最小的值作为最小值
         */
        min: {
            type: Number,
            default: undefined
        },
        /**
         * 渲染轴的最大值，不传入时默认获取segments中最大的值作为最大值
         */
        max: {
            type: Number,
            default: undefined
        },
        /**
         * 类型列表，用于覆盖默认的sucess/error/warning的颜色值
         */
        types: {
            type: Object,
            default () {
                return {};
            }
        },
        /* slider条的高度 */
        height: {
            type: Number,
            default: 10
        },
        /* 是否显示下标 */
        subscriptVisible: {
            type: Boolean,
            default: true
        },
        /* 移动框的类名 */
        popoverClassname: {
            type: [String, Array, Object],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            value: undefined,
            move: undefined,
            popoverAnimationClass: 'animation'
        };
    },

    mounted () {
        document.addEventListener('mousemove', this.mousemove);
        document.addEventListener('mouseup', this.mouseup);
    },

    computed: {
        /* 实际使用的type列表 */
        actualTypes () {
            return { ...DEFAULT_TYPES, ...this.types };
        },
        /* 实际使用的segments */
        actualSegments () {
            if (this.segments instanceof Array) {
                return this._genSegmentsFromArray();
            }

            return this._genSegmentsFromObject();
        },
        /* 实际使用的最小值 */
        actualMin () {
            return this.min !== undefined ? this.min : this._getExtremum('min');
        },
        /* 实际使用的最大值 */
        actualMax () {
            return this.max !== undefined ? this.max : this._getExtremum('max');
        },
        /* value所占据的比例 */
        valuePercent () {
            return this._computePosition(this.value);
        },
        styleInner () {
            return { height: this.height + 'px' };
        },
        stylePopover () {
            return { left: this.valuePercent };
        },
        stylePopoverValue () {
            return { bottom: this.height + 10 + 'px' };
        }
    },

    methods: {
        mousedown () {
            if (this.disabled) {
                return;
            }

            const rect = this.$refs.inner.getBoundingClientRect();

            this.move = {
                left: rect.left,
                width: rect.width
            };
            this.popoverAnimationClass = null;
        },
        mousemove (e) {
            if (!this.move || this.disabled) {
                return;
            }

            const { move, actualMax, actualMin } = this;
            const scale = (e.screenX - move.left) / move.width; // 比例

            let value = Math.round(scale * (actualMax - actualMin) + actualMin);
            // 拖动到边界时，不再允许拖动
            value = Math.min(value, this.actualMax);
            value = Math.max(value, this.actualMin);

            this.value = value;
            this.$emit('change', this.value);
        },
        mouseup () {
            this.move = undefined;
            this.popoverAnimationClass = 'animation';
        },
        /**
         * 点击线条时触发
         */
        innerClick (e) {
            this.mousedown();
            this.mousemove(e);
            this.mouseup();
        },
        /**
         * 计算segment的样式
         * @param {}
         */
        styleSegment (item) {
            const { color, zIndex, min, max } = item;

            return {
                left: this._computePosition(min),
                width: this._computePosition(max),
                backgroundColor: color,
                zIndex: zIndex
            };
        },
        /**
         * 计算位置
         * @param {number} value
         * @return {object}
         */
        _computePosition (value) {
            const { actualMin: min, actualMax: max } = this;

            return ((value - min) / (max - min)) * 100 + '%';
        },
        /**
         * 传入数组segments，生成实际使用的segments的数据
         * @return {array}
         */
        _genSegmentsFromArray () {
            const { segments, actualTypes } = this;

            return segments.map(i => {
                const item = { min: i.min, max: i.max, zIndex: i.zIndex || 1, color: i.color };

                if (i.type && actualTypes[i.type]) {
                    item.color = actualTypes[i.type];
                }

                return item;
            }).sort((a, b) => a.min - b.min);
        },
        /**
         * 传入对象segments，生成实际使用的segment的数据
         * @return {array}
         */
        _genSegmentsFromObject () {
            const { segments, actualTypes } = this;
            const ret = [];

            for (const key in segments) {
                const color = actualTypes[key] || key;
                let [min, max, zIndex = 1] = segments[key];

                if (min > max) {
                    [min, max] = [max, min];
                }

                ret.push({
                    color,
                    min,
                    max,
                    zIndex
                });
            }

            return ret.sort((a, b) => a - b);
        },
        /**
         * 获取极值，最大值/最小值
         * @param {string} type min/max
         * @return {number}
         */
        _getExtremum (type) {
            let extremum;

            this.actualSegments.map(i => {
                if (extremum === undefined) {
                    extremum = i[type];
                    return;
                }

                extremum = Math[type](extremum, i[type]);
            });

            return extremum;
        }
    },

    watch: {
        defaultValue: {
            immediate: true,
            handler (n) {
                this.value = n;
            }
        }
    },

    render () {
        const {
            value,
            stylePopoverValue,
            stylePopover,
            styleSegment,
            styleInner,
            actualMin,
            actualMax,
            subscriptVisible,
            popoverAnimationClass,
            popoverClassname,
            disabled
        } = this;

        return (
            <div class="m-segment-slider" data-test="slider-container">
                <div
                    class={['m-segment-inner', disabled && 'disabled']}
                    style={ styleInner }
                    ref="inner"
                    data-test="slider-inner"
                    onClick={ (e) => this.innerClick(e) }
                >
                    {
                        this.actualSegments.map(s => (
                            <div class="segment-item" data-test="segment" style={ styleSegment(s) }></div>
                        ))
                    }
                    {
                        subscriptVisible && <div class="subscript subscript-left" data-test="subscript">{ actualMin }</div>
                    }
                    {
                        subscriptVisible && <div class="subscript subscript-right" data-test="subscript">{ actualMax }</div>
                    }
                </div>
                {
                    value !== undefined && (
                        <div
                            class={[
                                'slider-popover',
                                popoverAnimationClass,
                                popoverClassname,
                                disabled && 'disabled'
                            ]}
                            style={stylePopover}
                            data-test="slider-popover"
                        >
                            <span
                                class="popover-value"
                                style={stylePopoverValue}
                                onMousedown={ (e) => this.mousedown(e) }
                            >{ value }</span>
                            <i class="popover-divider"></i>
                        </div>
                    )
                }
            </div>
        );
    },

    beforeDestroy () {
        document.removeEventListener('mousemove', this.mousemove);
        document.removeEventListener('mouseup', this.mouseup);
    }
};
</script>

<style lang="scss" scoped>
$color: #1d2a33;
$color-disabled: rgba($color, .65);

.m-segment-slider {
    position: relative;

    .m-segment-inner {
        position: relative;
        cursor: pointer;
        background-color: #f3f5f7;

        &.disabled {
            cursor: default;
        }
    }

    .segment-item {
        position: absolute;
        top: 0;
        bottom: 0;
    }

    .slider-popover {
        position: absolute;
        top: 0;
        bottom: 0;
        user-select: none;

        &.animation {
            transition: all 0.3s;
        }

        &.disabled {
            .popover-value {
                background-color: $color-disabled;
                cursor: not-allowed;

                &:after {
                    border-color: $color-disabled transparent transparent;
                }
            }

            .popover-divider {
                border-right-color: $color-disabled;
            }
        }

        .popover-value {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            font-size: 13px;
            color: #fff;
            padding: 2px 4px;
            background-color: $color;
            cursor: pointer;

            &:after {
                position: absolute;
                left: 50%;
                bottom: -13px;
                transform: translateX(-50%);
                border: 5px solid;
                border-color: $color transparent transparent;
                content: "";
            }
        }

        .popover-divider {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -1px;
            z-index: 9999;
            border-right: 1px solid $color;
        }
    }

    .subscript {
        position: absolute;
        top: 120%;
        font-size: 12px;

        &.subscript-left {
            left: 0;
        }

        &.subscript-right {
            right: 0;
        }
    }
}
</style>
