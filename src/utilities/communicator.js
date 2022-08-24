import Vue from "vue";

class Communicator {
  constructor(hub) {
    /** @type {import('vue').ComponentInstance} */
    this.hub = hub;
  }

  emit(...args) {
    this.hub.$emit.apply(this.hub, args);
  }

  /**
   *
   * @param {string} eventName
   * @param {Function} callback
   */
  listen(eventName, callback) {
    if (!callback || typeof callback !== "function")
      throw new Error("Invalid callback");
    this.hub.$on(eventName, (...args) => {
      console.log(args);
      callback.apply(null, args);
    });
  }
}

export function create() {
  const hub = new Vue();
  return new Communicator(hub);
}
