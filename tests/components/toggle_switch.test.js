import { mount } from "@vue/test-utils";
import ToggleSwitch from "../../src/components/ToggleSwitch";
import moxios from "moxios";

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

test("the label for the switch is passed as a prop", () => {
  const component = makeComponent({ label: "Test Toggle" });
  const label = component.find(".dd-toggleswitch label");

  expect(label.html()).toContain("Test Toggle");
});

test("the switch state is a prop, and is tied to the input state", () => {
  const component = makeComponent({ switchState: true });
  const input = component.find("input");

  expect(input.element.checked).toBe(true);
});

test("checking the input sends a request to the on url", done => {
  const component = makeComponent({
    switchState: false,
    onUrl: "/test/on/url"
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    expect(request.config.method).toBe("post");
    expect(request.config.url).toBe("/test/on/url");
    done();
  });
});

test("flipping the switch on sends the post body passed as a prop", done => {
  const component = makeComponent({
    switchState: false,
    onUrl: "/test/on/url",
    postBody: { test_id: 1 }
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    expect(JSON.parse(request.config.data)).toMatchObject({ test_id: 1 });
    done();
  });
});

test("unchecking the input sends the delete request to the off url", done => {
  const component = makeComponent({
    switchState: true,
    offUrl: "/test/off/url"
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    expect(request.config.method).toBe("delete");
    expect(request.config.url).toBe("/test/off/url");
    done();
  });
});

test("an event is fired if the switch on is succesful", done => {
  const component = makeComponent({
    switchState: false,
    offUrl: "/test/on/url"
  });

  moxios.stubRequest("/test/on/url", {
    status: 200
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const event = component.emitted()["toggle-switched-on"];
    expect(event).toBeDefined();
    done();
  });
});

test("an event is fired if the switch on request fails", done => {
  const component = makeComponent({
    switchState: false,
    offUrl: "/test/on/url"
  });

  moxios.stubRequest("/test/on/url", {
    status: 500
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const event = component.emitted()["toggle-switch-failed"];
    expect(event).toBeDefined();
    done();
  });
});

test("an event is fired if the switch off is successful", done => {
  const component = makeComponent({
    switchState: true,
    offUrl: "/test/off/url"
  });

  moxios.stubRequest("/test/off/url", {
    status: 200
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const event = component.emitted()["toggle-switched-off"];
    expect(event).toBeDefined();
    done();
  });
});

test("an event is fired if the switch off request is not successful", done => {
  const component = makeComponent({
    switchState: true,
    offUrl: "/test/off/url"
  });

  moxios.stubRequest("/test/off/url", {
    status: 400
  });

  const input = component.find("input");
  input.trigger("change");

  moxios.wait(() => {
    const event = component.emitted()["toggle-switch-failed"];
    expect(event).toBeDefined();
    done();
  });
});

test("the switch will be pending while waiting for a response", done => {
  const component = makeComponent({
    switchState: false,
    offUrl: "/test/on/url"
  });

  moxios.stubRequest("/test/on/url", {
    status: 200
  });

  const input = component.find("input");
  input.trigger("change");

  expect(component.vm.pending).toBe(true);

  moxios.wait(() => {
    expect(component.vm.pending).toBe(false);
    done();
  });
});

test("the switch off will be pending while waiting for a response", done => {
  const component = makeComponent({
    switchState: true,
    offUrl: "/test/off/url"
  });

  moxios.stubRequest("/test/off/url", {
    status: 200
  });

  const input = component.find("input");
  input.trigger("change");

  expect(component.vm.pending).toBe(true);

  moxios.wait(() => {
    expect(component.vm.pending).toBe(false);
    done();
  });
});

test("the switch is disabled whilst pending", done => {
  const component = makeComponent({
    switchState: true,
    offUrl: "/test/off/url"
  });

  moxios.stubRequest("/test/off/url", {
    status: 200
  });

  const input = component.find("input");
  input.trigger("change");

  expect(input.element.disabled).toBe(true);

  moxios.wait(() => {
    expect(input.element.disabled).toBe(false);
    done();
  });
});

function makeComponent(props = {}, options = {}) {
  const propsData = Object.assign(
    {
      label: "Test Toggle",
      switchState: true,
      onUrl: "/test/on/url",
      offUrl: "/test/off/url"
    },
    props
  );

  const mount_options = Object.assign({ propsData }, options);

  return mount(ToggleSwitch, mount_options);
}
