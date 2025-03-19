<template>
  <div class="btn-content">
    <Button
      v-if='!isPC'
      :loading="!clickAble"
      :iconSrc="config.iconSrc"
      :color="config.color"
      :iconSize="props.iconSize || config.iconSize"
      :width="props.width || config.width"
      :height="props.height || config.height"
      :loadingWidth="config.loadingWidth"
      :loadingHeight="config.loadingHeight"
      shape="circle"
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
import { useTranslate } from '../../../hooks/useTranslate';

const t = useTranslate();
const props = defineProps(ButtonProps);
const clickAble = ref(true);
const isPC = TUIGlobal.isPC;
const { localUserInfoExcludeVolume : localUserInfo } = toRefs(useUserInfoExcludeVolumeContext());
const targetVideoAvailable = ref(localUserInfo?.value.isVideoAvailable);
const isVideoAvailable = computed(() => localUserInfo?.value.isVideoAvailable);
const popoverValue = usePopover();
const configState = computed(() => {
  if (!clickAble.value) {
    return 'loadingConfig';
  }

  return isVideoAvailable.value ? 'basicConfig' : 'closedConfig';
});
const btnText = computed(() => (localUserInfo?.value.isVideoAvailable ? t.value('camera enabled') : t.value('camera disabled')));
const config = useBtnConfig('camera', configState);

const handleClick = async () => {
  clickAble.value = false;
  targetVideoAvailable.value = !isVideoAvailable.value;
  if (isVideoAvailable.value) {
    await TUICallKitServer.closeCamera();
  } else {
    await TUICallKitServer.openCamera('localVideo');
  }
  clickAble.value = true;
};
const handleMouseEnter = () => {
  popoverValue.value = 'camera';
}
</script>

<style lang="scss" scoped>
@import './style/common.scss';
</style>
