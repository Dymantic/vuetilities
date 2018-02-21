<template>
    <span class="dd-toggleswitch">
        <label>
            <span class="label-text">{{ label }}</span>
            <input type="checkbox" :disabled="pending" :checked="switchState" @change="flipSwitch">
            <span class="switch" :class="{'active': switchState, 'pending': pending }">
                <div class="rail"></div>
                <div class="knob" :style="knob_style"></div>
            </span>
        </label>
    </span>
</template>

<script>
import axios from "axios";

export default {
  props: {
    label: {
      type: String,
      required: true
    },
    "switch-state": {
      type: Boolean,
      required: true
    },
    "on-url": {
      type: String,
      required: true
    },
    "post-body": {
      type: Object,
      default() {
        return {};
      }
    },
    "off-url": {
      type: String,
      required: true
    },
    "on-color": {
      type: String
    }
  },

  data() {
    return {
      pending: false
    };
  },

  computed: {
    knob_style() {
      const on_colour = this.onColor || "#00FF00";

      if (this.switchState) {
        return {
          background: on_colour
        };
      }

      return {
        background: "#ccc"
      };
    }
  },

  methods: {
    flipSwitch(ev) {
      this.pending = true;
      if (!this.switchState) {
        axios
          .post(this.onUrl, this.postBody)
          .then(() => this.$emit("toggle-switched-on"))
          .catch(() => this.$emit("toggle-switch-failed"))
          .then(() => (this.pending = false));
      } else {
        axios
          .delete(this.offUrl)
          .then(() => this.$emit("toggle-switched-off"))
          .catch(() => this.$emit("toggle-switch-failed"))
          .then(() => (this.pending = false));
      }
    }
  }
};
</script>

<style lang="scss" type="text/css">
.dd-toggleswitch {
  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;

    .label-text {
      min-width: 3rem;
      margin-right: 1rem;
    }
  }

  .switch {
    position: relative;

    .rail {
      width: 2rem;
      height: 0.4rem;
      border-radius: 0.2rem;
      background: #ccc;
    }

    .knob {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      position: absolute;
      background: #ccc;
      z-index: 100;
      top: -0.25rem;
      right: -0.5rem;
      transition: 0.3s ease-in-out;
      transform: translate3d(0, 0, 0);
    }

    &.active {
      .knob {
        transform: translate3d(-2rem, 0, 0);
        background: currentColor;
      }
    }

    &.pending {
      transform: scale(0.95);

      .knob {
        transform: translate3d(-1rem, 0, 0);
        background: #ccc;
      }
    }
  }
}
</style>


