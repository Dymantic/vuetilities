<template>
    <span class="dd-dropdown">
        <a href="#"
           role="button"
           aria-haspopup="true"
           :aria-expanded="dropdown_open ? 'true' : 'false'"
           @click.prevent="handleDropdownClick"
           @keyup.down="handleKeyDown"
           @keyup.up="handleKeyUp"
           @keyup.enter="dropdown_open = true"
        >{{ name }}
          <svg height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </a>
        <div class="dropdown-content" ref="dropdown_content" v-show="dropdown_open" :style="alignment_style">
            <slot name="dropdown_content"></slot>    
        </div>
    </span>
    
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dropdown_open: false,
      dropdown_links: [],
      focus_position: null,
      alignment: null
    };
  },

  computed: {
    alignment_style() {
      if (this.alignment === "right") {
        return {
          right: 0,
          left: "auto",
          textAlign: "right"
        };
      }

      return {
        right: "auto",
        left: 0
      };
    }
  },

  mounted() {
    document.addEventListener("keyup", this.handleKeypress);

    this.dropdown_links = Array.prototype.slice.call(
      this.$refs.dropdown_content.querySelectorAll("a")
    );

    this.dropdown_links.forEach(link =>
      link.addEventListener("keyup", this.handleKeyUpOnLink)
    );

    this.alignment = this.getAlignment();
  },

  methods: {
    closeDropdown() {
      this.dropdown_open = false;
      this.focus_position = null;
      document.removeEventListener("click", this.handleBodyClick);
    },

    openDropdown() {
      this.dropdown_open = true;
      document.addEventListener("click", this.handleBodyClick);
    },

    handleDropdownClick() {
      if (!this.dropdown_open) {
        this.openDropdown();
        return;
      }

      this.closeDropdown();
    },

    handleBodyClick(ev) {
      if (this.$el.contains(ev.target) || this.$el == ev.target) {
        return;
      }

      if (this.dropdown_open) {
        this.closeDropdown();
      }
    },

    handleKeypress(ev) {
      switch (ev.keyCode) {
        case 27:
          this.closeDropdown();
          break;
        default:
          break;
      }
    },

    handleKeyDown() {
      if (!this.dropdown_open) {
        this.openDropdown();
        return;
      }

      this.focusNextDropDownLink();
    },

    handleKeyUp() {
      if (!this.dropdown_open) {
        this.openDropdown();
        return;
      }

      this.focusPrevDropDownLink();
    },

    handleKeyUpOnLink(ev) {
      switch (ev.keyCode) {
        case 40:
          this.focusNextDropDownLink();
          break;
        case 38:
          this.focusPrevDropDownLink();
          break;
        default:
          break;
      }
    },

    focusNextDropDownLink() {
      if (
        this.focus_position !== null &&
        this.focus_position < this.dropdown_links.length - 1
      ) {
        this.focus_position++;
      } else {
        this.focus_position = 0;
      }

      this.dropdown_links[this.focus_position].focus();
    },

    focusPrevDropDownLink() {
      if (this.focus_position === null || this.focus_position === 0) {
        this.focus_position = this.dropdown_links.length - 1;
      } else {
        this.focus_position--;
      }

      this.dropdown_links[this.focus_position].focus();
    },

    getAlignment() {
      const width = window.innerWidth;
      const dropdown_offset = this.$el.getBoundingClientRect().left;

      return width / 2 > dropdown_offset ? "left" : "right";
    }
  },

  beforeDestroy() {
    document.removeEventListener("keyup", this.handleKeypress);
  }
};
</script>

<style lang="scss" type="text/css">
.dd-dropdown {
  position: relative;

  & > a {
    text-decoration: none;
    color: currentColor;

    svg {
      fill: currentColor;
      margin-right: 8px;
      vertical-align: middle;
    }
  }

  .dropdown-content {
    position: absolute;
    top: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
    padding: 0.5rem 1rem;
    min-width: 100%;

    a {
      white-space: nowrap;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>


