import { mount } from "@vue/test-utils";
import Modal from "../../src/components/Modal";
import { assert } from "chai";

describe("Controlling modal behaviour", () => {
  it("can be hidden by setting show prop to false", () => {
    const wrapper = mount(Modal);

    wrapper.setProps({ show: false });

    let modal_mask = wrapper.find(".dd-modal-mask");

    assert.equal("none", modal_mask.element.style.display);
  });

  it("fills in header slot correctly", () => {
    const wrapper = mount(Modal, {
      slots: {
        header: "this is the header test"
      }
    });

    let header = wrapper.find(".modal-header");

    assert.include(header.html(), "this is the header test");
  });

  it("fills in body slot correctly", () => {
    const wrapper = mount(Modal, {
      slots: {
        body: "this is the body test"
      }
    });

    let body = wrapper.find(".modal-body");

    assert.include(body.html(), "this is the body test");
  });

  it("fills in footer slot correctly", () => {
    const wrapper = mount(Modal, {
      slots: {
        footer: "this is the footer test"
      }
    });

    let footer = wrapper.find(".modal-footer");

    assert.include(footer.html(), "this is the footer test");
  });
});
