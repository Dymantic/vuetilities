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
});
