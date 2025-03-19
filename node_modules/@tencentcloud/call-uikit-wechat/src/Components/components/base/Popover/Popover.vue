<template>
  <PopoverWx v-bind="$props" v-if="IN_WX_MINI_APP">
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
  </PopoverWx>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
};
</script>

<script setup lang="ts">
import PopoverWx from './PopoverWx/PopoverWx.vue';
import { IN_WX_MINI_APP } from '../util';
import { PopoverProps } from './Popover';

defineProps(PopoverProps);
const emit = defineEmits(['hover']);
const handleHover = () => {
  emit('hover');
};
</script>

