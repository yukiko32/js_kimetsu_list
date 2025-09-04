
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

async function drawList(category) {
  loading();
  try {
    const json = await fetchCharacters(url[category]);
    setTimeout(() => {
      nodeOps.html(listContainer, "");
      assemblyEl(json);
      loaded();
    }, 800);
  } catch (e) {
    console.error(e);
    loaded();
  }
}


const buttons = document.getElementsByName('choice');
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
