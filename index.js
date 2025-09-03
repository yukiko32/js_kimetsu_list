
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
  } else if (type === 'li') {
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
    createEl(ul, 'li', character.name);
    createEl(ul, 'li', character.category);

    const li = nodeOps.create('li');
    nodeOps.append(li, ul);
    nodeOps.append(listContainer, li);
  }
}

const spinner = document.getElementById("loading");
function loading() {
  spinner.classList.remove("loaded");
}

function loaded() {
  spinner.classList.add("loaded");
}

async function drawList(url) {
  nodeOps.html(listContainer, "");  // 画面をクリア
  loading();
  try {
    const json = await Promise.all([
      fetchCharacters(url),
      new Promise(resolve => setTimeout(resolve, 600)) // ローディング待機
    ]);
    assemblyEl(json[0]);
  } catch (e) {
    console.error(e);
  }
  loaded();
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
