import { mount } from "@vue/test-utils";
import Dropdown from "../../src/components/Dropdown";

test("the name of the parent link is passed as a prop", () => {
  const component = makeComponent({ name: "Test Dropdown" });
  const parent_link = component.find(".dd-dropdown > a");

  expect(parent_link.html()).toContain("Test Dropdown");
});

test("the dropdown has the correct role and aria attributes", () => {
  const component = makeComponent({ name: "Test Dropdown" });

  const with_role = component.find(".dd-dropdown > a[role=button]");
  const with_haspopup = component.find(".dd-dropdown > a[aria-haspopup]");
  const with_expanded = component.find(".dd-dropdown > a[aria-expanded]");

  expect(with_role.element).toBeDefined();
  expect(with_haspopup.element).toBeDefined();
  expect(with_expanded.element).toBeDefined();
});

test("the dropdown content is passed in as a slot", () => {
  const component = makeComponent(
    {},
    {
      slots: {
        dropdown_content: "Test dropdown content"
      }
    }
  );

  const dropdown = component.find(".dropdown-content");

  expect(dropdown.html()).toContain("Test dropdown content");
});

test("the dropdown content is hidden by default", () => {
  const component = makeComponent();

  const dropdown = component.find(".dropdown-content");

  expect(dropdown.element.style.display).toBe("none");
});

test("clicking the parent link opens the dropdown", () => {
  const component = makeComponent();

  clickDropdown(component);

  const dropdown = component.find(".dropdown-content");

  expect(dropdown.element.style.display).not.toBe("none");
});

test("clicking the parent link when dropdown is open closes the dropdown", () => {
  const component = makeComponent();
  component.setData({ dropdown_open: true });

  clickDropdown(component);

  const dropdown = component.find(".dropdown-content");

  expect(dropdown.element.style.display).toBe("none");
});

test("opening the dropdown sets the aria-expanded to true", () => {
  const component = makeComponent();

  clickDropdown(component);

  const with_expanded_aria = component.find(
    ".dd-dropdown > a[aria-expanded=true]"
  );

  expect(with_expanded_aria.element).toBeDefined();
});

test("the component has a list of links", () => {
  const component = makeComponent(
    {},
    {
      slots: {
        dropdown_content: `
        <a href="#">Link one</a>
        <a href="#">Link two</a>
        <a href="#">Link three</a>
        `
      }
    }
  );

  expect(component.vm.dropdown_links.length).toBe(3);
});

test("the dropdown may be opened by pressing the down key on keyboard", () => {
  const component = makeComponent();

  const parent_link = component.find(".dd-dropdown > a");
  parent_link.trigger("keyup", { keyCode: 40 });

  const dropdown = component.find(".dropdown-content");
  expect(dropdown.element.style.display).not.toBe("none");
});

test("the dropdown may be opened by pressing the up key on keyboard", () => {
  const component = makeComponent();

  const parent_link = component.find(".dd-dropdown > a");
  parent_link.trigger("keyup", { keyCode: 38 });

  const dropdown = component.find(".dropdown-content");
  expect(dropdown.element.style.display).not.toBe("none");
});

test("the dropdown may be opened by pressing the enter on the keyboard", () => {
  const component = makeComponent();

  const parent_link = component.find(".dd-dropdown > a");
  parent_link.trigger("keyup", { keyCode: 13 });

  const dropdown = component.find(".dropdown-content");
  expect(dropdown.element.style.display).not.toBe("none");
});

test("pressing down on a open focus will focus the first dropdown link", () => {
  const component = makeComponent(
    {},
    {
      slots: {
        dropdown_content: `
            <a href="#">Link one</a>
            <a href="#">Link two</a>
            <a href="#">Link three</a>
            `
      }
    }
  );

  component.setData({ dropdown_open: true });

  keypressDownOnDropdown(component);

  expect(component.vm.focus_position).toBe(0);
});

test("continuing to press the down key will cycle through the links", () => {
  const component = makeComponent(
    {},
    {
      slots: {
        dropdown_content: `
                <a href="#">Link one</a>
                <a href="#">Link two</a>
                <a href="#">Link three</a>
                `
      }
    }
  );
  component.setData({ dropdown_open: true, focus_position: 0 });

  keypressDownOnDropdown(component);

  expect(component.vm.focus_position).toBe(1);

  keypressDownOnDropdown(component);

  expect(component.vm.focus_position).toBe(2);

  keypressDownOnDropdown(component);

  expect(component.vm.focus_position).toBe(0);
});

test("pressing up on a open focus will focus the last dropdown link", () => {
  const component = makeComponent(
    {},
    {
      slots: {
        dropdown_content: `
              <a href="#">Link one</a>
              <a href="#">Link two</a>
              <a href="#">Link three</a>
              `
      }
    }
  );

  component.setData({ dropdown_open: true });

  keypressUpOnDropdown(component);

  expect(component.vm.focus_position).toBe(2);
});

test("continuing to press the down key will cycle through the links", () => {
  const component = makeComponent(
    {},
    {
      slots: {
        dropdown_content: `
                  <a href="#">Link one</a>
                  <a href="#">Link two</a>
                  <a href="#">Link three</a>
                  `
      }
    }
  );
  component.setData({ dropdown_open: true, focus_position: 0 });

  keypressUpOnDropdown(component);

  expect(component.vm.focus_position).toBe(2);

  keypressUpOnDropdown(component);

  expect(component.vm.focus_position).toBe(1);

  keypressUpOnDropdown(component);

  expect(component.vm.focus_position).toBe(0);
});

function makeComponent(props = {}, options = {}) {
  const propsData = Object.assign(
    {
      name: "Test Dropdown"
    },
    props
  );

  const mount_options = Object.assign({ propsData }, options);

  return mount(Dropdown, mount_options);
}

function clickDropdown(component) {
  const parent_link = component.find(".dd-dropdown > a");
  parent_link.trigger("click");
}

function keypressDownOnDropdown(component) {
  const parent_link = component.find(".dd-dropdown > a");
  parent_link.trigger("keyup", { keyCode: 40 });
}

function keypressUpOnDropdown(component) {
  const parent_link = component.find(".dd-dropdown > a");
  parent_link.trigger("keyup", { keyCode: 38 });
}
