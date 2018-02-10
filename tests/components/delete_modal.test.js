import { mount } from "@vue/test-utils";
import DeleteModal from "../../src/components/DeleteModal";

test("it can be passed the delete url as a prop", () => {
  const component = makeComponent({ deleteUrl: "/test/delete/url" });

  expect(component.vm.deleteUrl).toBe("/test/delete/url");
});

test("it can be passed the resource name as a prop", () => {
  const component = makeComponent({ resourceName: "test resource" });

  expect(component.vm.resourceName).toBe("test resource");
});

test("it shows the correct modal message", () => {
  const component = makeComponent({ resourceName: "test resource" });

  const delete_button = component.find(".dd-delete-modal-component > button");
  delete_button.trigger("click");

  let modal_body = component.find(".modal-body");

  expect(modal_body.html()).toContain(
    "Are you sure you want to delete test resource? This may not be reversable"
  );
});

test("it opens the modal when the button is clicked", () => {
  const component = makeComponent();
  const modal = component.find(".dd-modal-mask");
  const delete_button = component.find(".dd-delete-modal-component > button");

  expect(modal.element.style.display).toBe("none");

  delete_button.trigger("click");

  expect(modal.element.style.display).not.toBe("none");
});

test("has the actual delete form in the modal footer", () => {
  const component = makeComponent();

  expect(
    component.contains('.modal-footer form[action="/test/delete/url"]')
  ).toBe(true);
});

test("clicking the cancel button closes the modal", done => {
  const component = makeComponent();
  component.setData({ modalOpen: true });
  const modal = component.find(".dd-modal-mask");
  const delete_button = component.find(".dd-delete-modal-component > button");
  const cancel_button = component.find(".modal-footer button[type=button]");

  delete_button.trigger("click");
  expect(modal.element.style.display).not.toBe("none");

  cancel_button.trigger("click");
  //   expect(modal.element.style.display).toBe("none");
  expect(component.vm.modalOpen).toBe(false);
  done();
});

function makeComponent(props = {}) {
  const propsData = Object.assign(
    {
      resourceName: "test resource",
      deleteUrl: "/test/delete/url"
    },
    props
  );

  return mount(DeleteModal, { propsData });
}
