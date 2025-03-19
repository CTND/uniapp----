<template>
  <div class="btn-content">
    <Button
      :iconSrc="config.iconSrc"
      :color="config.color"
      :iconSize="props.iconSize || config.iconSize"
      :width="props.width || config.width"
      :height="props.height || config.height"
      :shape="config.shape"
      @click="handleClick"
    >
    </Button>
    <TKText
      v-if="config.showText"
      width="60px"
      :truncated="true"
      :textStyle="config.textStyle"
      :color="config.textColor"
      :size="config.textSize"
      :lineClamp='2'
    >
      {{getButtonText()}}
    </TKText>
  </div>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
};
</script>

<script lang="ts" setup>
import { computed, toRefs } from '../../../../adapter-vue';
import { TUICallKitServer, TUIGlobal } from '../../../../TUICallService/index';
import { DeviceType } from '../../../../TUICallService/const';
import Button from '../../base/Button/Button.vue';
import TKText from '../../base/TKText/TKText.vue';
import { useBtnConfig } from './hooks/useConfig';
import { useTranslate } from '../../../hooks';
import { ButtonProps } from './props/Button';
import { useCallInfoContext, usePopover } from '../../../hooks';

const isWeChat = TUIGlobal.isWeChat;
const isPC = TUIGlobal.isPC;
const props = defineProps(ButtonProps);
const { isEarPhone, isMuteSpeaker } = toRefs(useCallInfoContext());
const popoverValue = usePopover();
const t = useTranslate();
const wxConfigState = computed(() => (isEarPhone.value ? 'closedConfig' : 'basicConfig'));
const webConfigState = computed(() => (isMuteSpeaker.value ? 'closedConfig' : 'basicConfig'));
const config = isWeChat ? useBtnConfig('speaker', wxConfigState) : useBtnConfig('speaker', webConfigState);
const btnText = computed(() => (isEarPhone.value ? t.value('speaker disabled') : t.value('speaker enabled')));
const handleClick = async () => {
  TUICallKitServer.setSoundMode();
};
const getButtonText = () => {
  return btnText.value;
};
const handleMouseEnter = () => {
  popoverValue.value = 'speaker';
};
</script>

<style lang="scss" scoped>
@import './style/common.scss';
</style>
