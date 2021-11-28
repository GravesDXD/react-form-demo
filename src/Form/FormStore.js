import { deepCopy, deepGet, deepSet } from "./utils";

//定义存储form数据,模式是发布订阅
export default class FormStore {
  constructor(values = {}, rules = {}) {
    this.listeners = [];
    this.errors = {};
    this.initialValues = values;
    this.values = deepCopy(values);
    this.rules = rules;
  }
  notify(name) {
    this.listeners.forEach((listener) => listener(name));
  }
  get(name) {
    return name === undefined ? { ...this.values } : deepGet(this.values, name);
  }
  set(name, value, validate = true) {
    if (typeof name === "string") {
      deepSet(this.values, name, value);
      if (validate) this.validate(name);
      this.notify(name);
    } else if (name) {
      Object.keys(name).forEach((n) => this.set(n, name[n]));
    }
  }
  reset() {
    this.errors = {};
    this.values = deepCopy(this.initialValues);
    this.notify("*");
  }
  error(...args) {
    let [name, value] = args;

    if (args.length === 0) return this.errors;

    if (typeof name === "number") {
      name = Object.keys(this.errors)[name];
    }

    if (args.length === 2) {
      if (value === undefined) {
        delete this.errors[name];
      } else {
        this.errors[name] = value;
      }
    }

    return this.errors[name];
  }
  validate(name) {
    if (name === undefined) {
      Object.keys(this.rules).forEach((n) => this.validate(n));
      this.notify("*");

      const message = this.error(0);
      const error = message === undefined ? undefined : new Error(message);
      return [error, this.get()];
    } else {
      const validator = this.rules[name];
      const value = this.get(name);
      const result = validator ? validator(value, this.values) : true;
      const message = this.error(
        name,
        result === true ? undefined : result || ""
      );

      const error = message === undefined ? undefined : new Error(message);
      return [error, value];
    }
  }
  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }
}
