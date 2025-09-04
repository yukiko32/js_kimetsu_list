
const pass = `https://ihatov08.github.io`;
const apiPass = `${pass}/kimetsu_api/api`;
const url = {
  all: `${apiPass}/all.json`,
  kisatsutai: `${apiPass}/kisatsutai.json`,
  hashira: `${apiPass}/hashira.json`,
  oni: `${apiPass}/oni.json`
}


const nodeOps = {
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

async function fetchCharacters(url) {
  const response = await fetch(url);
  return await response.json();
}

function createEl(parent, type, value, cla) {
  const tag = nodeOps.create(type);
  if (type === 'img') {
    nodeOps.setAttr(tag, 'src', value);
  } else {
    nodeOps.html(tag, value);
  }
  cla && tag.classList.add(cla);
  nodeOps.append(parent, tag);
}


const body = nodeOps.qs('body');
const listContainer = nodeOps.qs('#js-list', body);
function assemblyEl(json) {
  for (const character of json) {
    const li = nodeOps.create('li');
    createEl(li, 'img', `${pass}${character.image}`);
    createEl(li, 'p', character.name, 'name');
    createEl(li, 'p', character.category, 'category');
    nodeOps.append(listContainer, li);
  }
}

const spinner = nodeOps.qs('.spinner', body);
const load = nodeOps.qs('.load', body);
function loading() {
  spinner.classList.remove('loaded');
  load.classList.remove('loaded');
}

function loaded() {
  spinner.classList.add('loaded');
  load.classList.add('loaded');
}

function getTimeLeft(start, time) {
  const elapsed = Date.now() - start;
  return Math.max(0, time - elapsed);
}

function displayErrorMsg(msg) {
  const error = nodeOps.qs('.error-msg');
  nodeOps.html(error, msg);
}

async function drawList(category) {
  loading();
  const start = Date.now();
  try {
    const json = await fetchCharacters(url[category]);
    const delay = getTimeLeft(start, 600);
    setTimeout(() => {
      nodeOps.html(listContainer, "");
      assemblyEl(json);
      loaded();
    }, delay);
  } catch {
    const delay = getTimeLeft(start, 600);
    setTimeout(() => {
      displayErrorMsg('データを取得できませんでした');
      loaded();
    }, delay);
  }
}


const buttons = nodeOps.qsAll('[name="choice"]');
for (const button of buttons) {
  button.addEventListener("change", (event) => {
    const category = event.target.value;
    drawList(category);
  });
}

function init(category) {
  drawList(category);
}

init('all');
