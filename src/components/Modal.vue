<template>
  <transition name="modal">
    <base-modal :show="show"></base-modal>
    </transition>
</template>

<script>
import BaseModal from "./BaseModal";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  components: {
    "base-modal": BaseModal
  }
};
</script>
