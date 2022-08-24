import Vue from "vue";

export default function render(ComponentDefinition, props, mountNode) {
  const Component = Vue.extend(ComponentDefinition);

  if (mountNode) {
    new Component({ propsData: props }).$mount(mountNode);
  }
}
