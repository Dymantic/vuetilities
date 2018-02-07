<template>
  <span class="dd-delete-modal-component">
      <button class="p-2 bg-red-light mx-2 text-white" @click="modalOpen = true">Delete</button>
      <transition name="modal">
        <div class="dd-modal-mask" v-show="modalOpen">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header bg-red-light p-3">
                <p class="text-lg">Are you sure?</p>
              </div>
              <div class="modal-body py-8 px-4">
                <p>{{ confirm_message }}</p>
              </div>
              <div class="modal-footer flex justify-end items-center pb-4 px-4">
                <button class="p-2 mx-2 bg-grey-light text-white" type="button" @click="modalOpen = false">Cancel</button>
                <form :action="deleteUrl" @submit="submit($event)" method="POST">
                  <input type="hidden" name="_method" value="DELETE">
                  <button class="p-2 mx-2 bg-red-light text-white" :disabled="waiting" type="submit">OK, Delete</button> 
                </form>
              </div>
            </div>
          </div>
        </div>
      </transition>
  </span>
</template>

<script>
import axios from "axios";

export default {
  props: {
    "delete-url": {
      type: String
    },
    "resource-name": {
      type: String,
      required: true
    },
    redirects: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      modalOpen: false,
      waiting: false
    };
  },

  computed: {
    confirm_message() {
      return `Are you sure you want to delete ${
        this.resourceName
      }? This may not be reversable.`;
    }
  },

  methods: {
    submit(event) {
      if (this.redirects) {
        return false;
      }
      event.preventDefault();

      this.waiting = true;
      axios
        .delete(this.deleteUrl)
        .then(() => this.$emit("item-deleted"))
        .catch(err => this.$emit("delete-request-failed", err.response))
        .then(this.endRequest);
    },

    endRequest() {
      this.modalOpen = false;
      this.waiting = false;
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.dd-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 100%;
    max-width: 600px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    max-height: 95vh;
    color: #333;
  }

  .modal-body {
    max-height: 85vh;
    overflow-y: auto;
  }
  .modal-footer {
    max-height: 100px;
  }
}

.modal-enter,
.modal-leave {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
