/**
 * DOM操作ユーティリティ
 */
export const nodeOps = {
  qs(selector, scope) {
    return (scope || document).querySelector(selector);
  },
  qsAll(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  create(type) {
    return document.createElement(type);
  },
  append(parent, target) {
    parent.appendChild(target);
  },
  html(target, value) {
    target.innerHTML = value;
  },
  setAttr(parent, type, value) {
    parent.setAttribute(type, value);
  }
}
