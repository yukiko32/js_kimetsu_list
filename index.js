import { nodeOps } from './dom.js';
import { baseUrl, url, fetchCharacters } from './api.js';


/**
 * 要素を作成して親に追加
 * @param {HTMLElement} parent 
 * @param {string} type 
 * @param {string} value 
 * @param {string} [cla] クラス名
 */
function appendEl(parent, type, value, cla) {
  const tag = nodeOps.create(type);
  if (type === 'img') {
    nodeOps.setAttr(tag, 'src', value);
  } else {
    nodeOps.html(tag, value);
  }
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
 * JSONからリスト要素を生成する
 * @param {Array<{name:string, category:string, image:string}>} json 
 */
function renderList(json) {
  for (const character of json) {
    const li = nodeOps.create('li');
    appendEl(li, 'img', `${baseUrl}${character.image}`);
    appendEl(li, 'p', character.name, 'name');
    appendEl(li, 'p', character.category, 'category');
    nodeOps.append(listContainer, li);
  }
}


const loadingSpinner = nodeOps.qs('.spinner', body);
const loadingOverlay = nodeOps.qs('.overlay', body);

/** ローディング開始 */
function loading() {
  loadingSpinner.classList.remove('loaded');
  loadingOverlay.classList.remove('loaded');
}

/** ローディング終了 */
function loaded() {
  loadingSpinner.classList.add('loaded');
  loadingOverlay.classList.add('loaded');
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
      renderList(json);
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


/**
 * ラジオボタンのイベントを設定する
 * @returns {void}
 */
function setButtons() {
  // ラジオボタンが押されたら表示を切り替える
  const buttons = nodeOps.qsAll('[name="choice"]');
  for (const button of buttons) {
    button.addEventListener("change", (event) => {
      const category = event.target.value;
      drawList(category);
    });
  }
}


/**
 * 初期化
 * @param {'all'|'kisatsutai'|'hashira'|'oni'} category 
 */
function init(category) {
  setButtons();
  drawList(category);
}


init('all');
