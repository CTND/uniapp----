<template>
  <div class="btn-content">
    <Button
      v-if="!isPC"
      :loading="!clickAble"
      :iconSrc="config.iconSrc"
      :color="config.color"
      :iconSize="config.iconSize"
      :width="config.width"
      :height="config.height"
      :loadingWidth="config.loadingWidth"
      :loadingHeight="config.loadingHeight"
      :shape="config.shape"
      @click="handleClick"
    >
    </Button>
    <TKText
      v-if="config.showText"
      :textStyle="config.textStyle"
      :color="config.textColor"
      :size="config.textSize"
    >
      {{ btnText }}
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
import { computed, toRefs, ref } from '../../../../adapter-vue';
import { TUICallKitServer, TUIGlobal } from '../../../../TUICallService/index';
import { DeviceType } from '../../../../TUICallService/const';
import Button from '../../base/Button/Button.vue';
import TKText from '../../base/TKText/TKText.vue';
import { useUserInfoExcludeVolumeContext, usePopover } from '../../../hooks';
import { ButtonProps } from './props/Button';
import { useBtnConfig } from './hooks/useConfig'
import { useTranslate } from '../../../hooks';

defineProps(ButtonProps);
const isPC = TUIGlobal.isPC;
const clickAble = ref(true);
const { localUserInfoExcludeVolume : localUserInfo } = toRefs(useUserInfoExcludeVolumeContext());
const popoverValue = usePopover();
const configState = computed(() => {
  if (!clickAble.value) {
    return 'loadingConfig';
  }

  return localUserInfo?.value.isAudioAvailable ? 'basicConfig' : 'closedConfig';
});
const config = useBtnConfig('microphone', configState);
const t = useTranslate();
const btnText = computed(() => (localUserInfo?.value.isAudioAvailable ? t.value('microphone enabled') : t.value('microphone disabled')));
const handleClick = async () => {
  if (localUserInfo?.value.isAudioAvailable) {
    await TUICallKitServer.closeMicrophone();
  } else {
    await TUICallKitServer.openMicrophone();
  }
};
const handleMouseEnter = () => {
  popoverValue.value = 'microphone';
};
</script>

<style lang="scss" scoped>
@import './style/common.scss';
</style>
