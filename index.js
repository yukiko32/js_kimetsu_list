
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

function createEl(parent, type, value) {
  const tag = nodeOps.create(type);
  if (type === 'img') {
    nodeOps.setAttr(tag, 'src', value);
  } else {
    nodeOps.html(tag, value);
  }
  nodeOps.append(parent, tag);
}


const body = nodeOps.qs('body');
const listContainer = nodeOps.qs('#js-list', body);
function assemblyEl(json) {
  for (const character of json) {

    const ul = nodeOps.create('ul');
    createEl(ul, 'img', `${pass}${character.image}`);
    createEl(ul, 'p', character.name);
    createEl(ul, 'p', character.category);

    const li = nodeOps.create('li');
    nodeOps.append(li, ul);
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

async function drawList(url) {
  loading();
  try {
    const json = await fetchCharacters(url);
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
    const checkValue = event.target.value;
    drawList(url[checkValue]);
  });
}

function init(category) {
  drawList(url[category]);
}

init('all');
