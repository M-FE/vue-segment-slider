<template>
    <div>
        <h2>基础用法</h2>
        <Slider
            :defaultValue="1000"
            :segments="segments"
        />
        <h2>禁用</h2>
        <Slider
            :defaultValue="1000"
            :segments="segments"
            :disabled="true"
        />
    </div>
</template>

<script>
import { Slider } from '../src/main';

export default {
    data () {
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
