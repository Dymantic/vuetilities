<template>
  <span class="dd-delete-modal-component">
      <button class="p-2 bg-red mx-2 text-white" @click="modalOpen = true">Delete</button>
      <transition name="modal">
      <modal :show="modalOpen">
        <div slot="header" class="bg-red">
          <p class="text-lg">Are you sure?</p>
        </div>
        <div slot="body">
          <p>{{ confirm_message }}</p>
        </div>
        <div slot="footer" class="flex justify-end items-center">
          <button class="p-2 mx-2 bg-grey-light text-white" type="button" @click="modalOpen = false">Cancel</button>
          <form :action="deleteUrl" @submit="submit($event)">
            <button class="p-2 mx-2 bg-red text-white" :disabled="waiting" type="submit">OK, Delete</button> 
          </form>
        </div>
      </modal>
      </transition>
  </span>
</template>

<script>
import Modal from "./BaseModal";
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

  components: {
    modal: Modal
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
