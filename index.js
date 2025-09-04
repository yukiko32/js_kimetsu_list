/**
 * ベースURL
 * @type {string}
 */
const pass = `https://ihatov08.github.io`;


/**
 * APIのベースURL
 * @type {string}
 */
const apiPass = `${pass}/kimetsu_api/api`;


/**
 * APIの各JSONファイルURL
 * @type {{all: string, kisatsutai: string, hashira: string, oni: string}}
 */
const url = {
  all: `${apiPass}/all.json`,
  kisatsutai: `${apiPass}/kisatsutai.json`,
  hashira: `${apiPass}/hashira.json`,
  oni: `${apiPass}/oni.json`
}


/**
 * DOM操作ユーティリティ
 */
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


/**
 * APIからJSONを取得
 * @param {string} url 
 * @returns {Promise<any>} JSONデータ
 */
async function fetchCharacters(url) {
  const response = await fetch(url);
  return await response.json();
}


/**
 * 要素を作成して親に追加
 * @param {HTMLElement} parent 
 * @param {string} type 
 * @param {string} value 
 * @param {string} [cla] クラス名
 */
function createEl(parent, type, value, cla) {
  const tag = nodeOps.create(type);
  if (type === 'img') {
    nodeOps.setAttr(tag, 'src', value);
  } else {
    nodeOps.html(tag, value);
  }
  // cla && tag.classList.add(cla);
  if (Array.isArray(cla)) {
    tag.classList.add(...cla);
  } else if (cla) {
    tag.classList.add(cla);
  }
  nodeOps.append(parent, tag);
}


const body = nodeOps.qs('body');
const listContainer = nodeOps.qs('#js-list', body);


/**
 * JSONからリスト要素を組み立てる
 * @param {Array<{name:string, category:string, image:string}>} json 
 */
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


/** ローディング開始 */
function loading() {
  spinner.classList.remove('loaded');
  load.classList.remove('loaded');
}


/** ローディング終了 */
function loaded() {
  spinner.classList.add('loaded');
  load.classList.add('loaded');
}


/**
 * 指定時間から経過時間を引き、残り時間を取得
 * @param {number} start 開始時刻（Date.now()）
 * @param {number} time 最低表示時間（ms）
 * @returns {number} 残り時間（ms）
 */
function getTimeLeft(start, time) {
  const elapsed = Date.now() - start;
  return Math.max(0, time - elapsed);
}


/**
 * エラーメッセージを表示
 * @param {string} msg 
 */
function displayErrorMsg(msg) {
  const error = nodeOps.qs('.error-msg');
  nodeOps.html(error, msg);
}


/**
 * キャラクターリストを描画
 * @param {'all'|'kisatsutai'|'hashira'|'oni'} category 
 */
async function drawList(category) {
  loading();
  const start = Date.now();
  try {
    const json = await fetchCharacters(url[category]);
    const delay = getTimeLeft(start, 600);
    // ローディング画面のあとにコンテンツを表示する
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


// ラジオボタンが押されたら表示を切り替える
const buttons = nodeOps.qsAll('[name="choice"]');
for (const button of buttons) {
  button.addEventListener("change", (event) => {
    const category = event.target.value;
    drawList(category);
  });
}


/**
 * 初期化
 * @param {'all'|'kisatsutai'|'hashira'|'oni'} category 
 */
function init(category) {
  drawList(category);
}


init('all');
