<template>
    <Slider
        :defaultValue="1000"
        :segments="segments"
    />
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
