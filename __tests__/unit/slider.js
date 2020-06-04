import { shallowMount } from '@vue/test-utils';
import { find, findAll, contains } from '@/utils/test';
import Slider from '@/Slider';
import { DEFAULT_TYPES } from '@/config';

const segmentsObj = {
    success: [0, 100, 10],
    '#123': [200, 100]
};

const segmentsArr = [
    { min: 100, max: 200, color: '#123' },
    { min: 0, max: 100, type: 'success', zIndex: 10 }
];

const actualSegments = [
    { min: 0, max: 100, color: DEFAULT_TYPES.success, zIndex: 10 },
    { min: 100, max: 200, color: '#123', zIndex: 1 }
];

describe('Slider', () => {
    it('初始化完成之后，渲染selector为slider-container、slider-popover的容器', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                defaultValue: 100
            }
        });
        expect(contains(wrapper, 'slider-container')).toBeTruthy();
        expect(contains(wrapper, 'slider-popover')).toBeTruthy();
    });

    it('segments为对象时，格式化为标准数据格式', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsObj
            }
        });

        expect(wrapper.vm.actualSegments).toEqual(actualSegments);
    });

    it('segments为数组时，格式化为标准数据格式', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr
            }
        });

        expect(wrapper.vm.actualSegments).toEqual(actualSegments);
    });

    it('不传入min和max时，默认获取segments中的最值', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr
            }
        });

        expect(wrapper.vm.actualMin).toBe(0);
        expect(wrapper.vm.actualMax).toBe(200);
    });

    it('传入了min和max时，使用传入的min和max', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                min: -100,
                segments: segmentsArr
            }
        });

        expect(wrapper.vm.actualMin).toBe(-100);
        expect(wrapper.vm.actualMax).toBe(200);
    });

    it('传入segmentsArr数据，应该存在两个segment段', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr
            }
        });
        expect(findAll(wrapper, 'segment').length).toBe(2);
    });

    it('通过subscriptVisible来控制下标是否显示', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr,
                subscriptVisible: true
            }
        });

        expect(findAll(wrapper, 'subscript').length).toBe(2);
    });

    it('最大值为200，最小值为0时，value为100时，位置为50%', () => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr,
                defaultValue: 100
            }
        });

        expect(wrapper.vm.valuePercent).toBe('50%');
    });

    it('popover被按下时，记录鼠标开始时的位置', (done) => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr,
                defaultValue: 100
            }
        });

        const popover = find(wrapper, 'slider-popover');
        popover.trigger('mousedown');
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.move).not.toEqual(undefined);
            done();
        });
    });

    it('横线段点击时，触发value修改', (done) => {
        const wrapper = shallowMount(Slider, {
            propsData: {
                segments: segmentsArr,
                defaultValue: 100
            }
        });

        const inner = find(wrapper, 'slider-inner');
        inner.trigger('click', {
            screenX: 500
        });

        wrapper.vm.$nextTick(() => {
            expect(wrapper.emitted().change[0]).toEqual([200]);
            expect(wrapper.vm.value).toEqual(200);
            done();
        });
    });
});
