import { mount } from "@vue/test-utils";
import Modal from "../../src/components/Modal";
import moxios from "moxios";

it("can be hidden by setting show prop to false", () => {
  const modal = makeComponent({ show: false });

  const modal_mask = modal.find(".dd-modal-mask");
  expect(modal_mask.element.style.display).toBe("none");
});

test("setting the show prop to true opens the modal", () => {
  const modal = makeComponent({ show: false });
  modal.setProps({ show: true });

  const modal_mask = modal.find(".dd-modal-mask");
  expect(modal_mask.element.style.display).not.toBe("none");
});

it("fills in header slot correctly", () => {
  const modal = mount(Modal, {
    slots: {
      header: "this is the header test"
    }
  });

  const header = modal.find(".modal-header");

  expect(header.html()).toContain("this is the header test");
});

it("fills in body slot correctly", () => {
  const modal = mount(Modal, {
    slots: {
      body: "this is the body test"
    }
  });

  const body = modal.find(".modal-body");

  expect(body.html()).toContain("this is the body test");
});

it("fills in footer slot correctly", () => {
  const modal = mount(Modal, {
    slots: {
      footer: "this is the footer test"
    }
  });

  const footer = modal.find(".modal-footer");

  expect(footer.html()).toContain("this is the footer test");
});

function makeComponent(props = {}) {
  const propsData = Object.assign(
    {
      show: false
    },
    props
  );

  return mount(Modal, { propsData });
}
