import { mount } from "@vue/test-utils";
import DeleteModal from "../../src/components/DeleteModal";
import moxios from "moxios";

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

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
  const modal = component.find(".dd-modal-mask");
  const delete_button = component.find(".dd-delete-modal-component > button");
  const cancel_button = component.find(".modal-footer button[type=button]");

  delete_button.trigger("click");
  expect(modal.element.style.display).not.toBe("none");

  cancel_button.trigger("click");

  expect(component.vm.modalOpen).toBe(false);
  done();
});

it("no axios calls are made if the redirect prop is true", done => {
  const component = makeComponent({ redirects: true });

  submitForm(component);

  moxios.wait(() => {
    let request = moxios.requests.mostRecent();
    expect(request).not.toBeDefined();
    done();
  });
});

it("disables the confirm button while delete ajax request being made", () => {
  const component = makeComponent();

  submitForm(component);

  const confirm_button = component.find("form button[type=submit]");
  expect(confirm_button.element.disabled).toBe(true);
});

it("closes the modal on a successfully axios call", done => {
  const component = makeComponent();
  const modal = component.find(".dd-modal-mask");

  moxios.stubRequest("/test/delete/url", {
    status: 200
  });

  submitForm(component);

  moxios.wait(() => {
    expect(modal.element.style.display).toEqual("none");
    done();
  });
});

it("it emits an event when a successfull delete request is made", done => {
  const component = makeComponent();

  moxios.stubRequest("/test/delete/url", {
    status: 200
  });

  submitForm(component);

  moxios.wait(() => {
    expect(component.emitted()["item-deleted"]).toBeDefined();
    done();
  });
});

it("emits an event if the delete request fails", done => {
  const component = makeComponent();

  moxios.stubRequest("/test/delete/url", {
    status: 500
  });

  submitForm(component);

  moxios.wait(() => {
    const event = component.emitted()["delete-request-failed"];
    expect(event).toBeDefined();
    expect(event[0][0].status).toEqual(500);
    done();
  });
});

it("button is not disabled after request completes", done => {
  const component = makeComponent();

  moxios.stubRequest("/test/delete/url", {
    status: 500
  });

  const form = component.find('form[action="/test/delete/url"]');
  form.trigger("submit");

  moxios.wait(() => {
    const confirm_button = component.find("form button[type=submit]");
    expect(confirm_button.element.disabled).toBe(false);
    done();
  });
});

it("closes the modal after a failed request", done => {
  const component = makeComponent();
  const modal = component.find(".dd-modal-mask");

  moxios.stubRequest("/test/delete/url", {
    status: 500
  });

  submitForm(component);

  moxios.wait(() => {
    expect(modal.element.style.display).toBe("none");
    done();
  });
});

it("accepts a csrf token prop", () => {
  const component = makeComponent({ csrfToken: "xxx-123" });

  const input = component.contains(
    "input.csrf-token[value=xxx-123][name=_token]"
  );

  expect(input).toBe(true);
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

function submitForm(component) {
  const form = component.find('form[action="/test/delete/url"]');
  form.trigger("submit");
}
