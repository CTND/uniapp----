<template>
  <div>
    <PortalMini :disabled="disabled" v-if="IN_MINI_APP" ><slot /></PortalMini>
  </div>
</template>

<script setup lang="ts">
import { computed } from '../../../../adapter-vue';
import PortalMini from './miniprogram/Portal.vue';
import { PortalProps } from './Portal';
import { checkVueVersion, IN_MINI_APP } from '../util';

defineProps(PortalProps);

const { majorVersion } = checkVueVersion();
const isVue3 = computed(() => majorVersion === '3');
const isVue2 = computed(() => majorVersion === '2');
</script>
