import { mount } from "@vue/test-utils";
import DeleteModal from "../../src/components/DeleteModal";
import { assert } from "chai";
import moxios from "moxios";
import Vue from "vue";

describe("Controlling modal behaviour", () => {
  let wrapper = null;

  beforeEach(() => {
    moxios.install();
    wrapper = makeWrapper();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("can be passed the delete resource url as a prop", () => {
    assert.equal("/test/delete/url", wrapper.props().deleteUrl);
  });

  it("opens the modal when button is clicked", () => {
    clickDeleteButton();

    assert.isTrue(wrapper.vm.modalOpen);

    // let modal = wrapper.find(".dd-modal-mask");
    // assert.equal("none", modal.element.style.display);
    // assert.isTrue(wrapper.vm.)
  });

  it("displays the correct modal message", () => {
    clickDeleteButton();

    let modal_body = wrapper.find(".modal-body");

    assert.include(
      modal_body.html(),
      "Are you sure you want to delete test thing? This may not be reversable"
    );
  });

  it("has the actual delete form in the modal footer", () => {
    assert.isTrue(
      wrapper.contains('.modal-footer form[action="/test/delete/url"]')
    );
  });

  it("clicking the cancel button closes the modal", () => {
    clickDeleteButton();

    clickCancelButton();

    assert.isFalse(wrapper.vm.modalOpen);
  });

  it("has an actual submit button for the delete form", () => {
    assert.isTrue(wrapper.contains(".modal-footer button[type=submit]"));
  });

  it("if redirect prop is false clicking submit button sends axios request", done => {
    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      assert.equal("/test/delete/url", request.config.url);
      assert.equal("delete", request.config.method);
      done();
    });
  });

  it("no axios calls are made if the redirect prop is true", done => {
    wrapper.setProps({ redirects: true });

    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      assert.notExists(request);
      done();
    });
  });

  it("disables the confirm button while delete ajax request being made", () => {
    clickDeleteButton();

    clickConfirmButton();

    let confirm_button = wrapper.find("form button[type=submit]");
    assert.isTrue(confirm_button.element.disabled);
  });

  it("closes the modal on a successfully axios call", done => {
    let modal = wrapper.find(".dd-modal-mask");
    moxios.stubRequest("/test/delete/url", {
      status: 200
    });
    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      assert.equal("none", modal.element.style.display);
      done();
    });
  });

  it("it emits an event when a successfull delete request is made", done => {
    moxios.stubRequest("/test/delete/url", {
      status: 200
    });
    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      assert.exists(wrapper.emitted()["item-deleted"]);
      done();
    });
  });

  it("emits an event if the delete request fails", done => {
    moxios.stubRequest("/test/delete/url", {
      status: 500
    });
    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      let event = wrapper.emitted()["delete-request-failed"];
      assert.exists(event);
      assert.include(event[0][0], { status: 500 });
      done();
    });
  });

  it("button is not disabled after request completes", done => {
    moxios.stubRequest("/test/delete/url", {
      status: 500
    });
    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      let confirm_button = wrapper.find("form button[type=submit]");
      assert.isFalse(confirm_button.element.disabled);
      done();
    });
  });

  it("closes the modal after a failed request", done => {
    let modal = wrapper.find(".dd-modal-mask");
    moxios.stubRequest("/test/delete/url", {
      status: 500
    });
    clickDeleteButton();

    clickConfirmButton();

    moxios.wait(() => {
      assert.equal("none", modal.element.style.display);
      done();
    });
  });

  it("accepts a csrf token prop", () => {
    wrapper = makeWrapper({ csrfToken: "xxx-123" });

    let input = wrapper.find("input.csrf-token");

    assert.exists(input.element);
  });

  function makeWrapper(prop_data = {}) {
    return mount(DeleteModal, {
      propsData: Object.assign(
        {
          deleteUrl: "/test/delete/url",
          resourceName: "test thing"
        },
        prop_data
      )
    });
  }

  function clickDeleteButton() {
    let button = wrapper.find(".dd-delete-modal-component > button");
    button.trigger("click");
  }

  function clickCancelButton() {
    let cancel_button = wrapper.find(".modal-footer button[type=button]");
    cancel_button.trigger("click");
  }

  function clickConfirmButton() {
    let confirm_button = wrapper.find(".modal-footer form");
    confirm_button.trigger("submit");
  }
});
