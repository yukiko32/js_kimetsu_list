/**
 * ベースURL
 * @type {string}
 */
const baseUrl = `https://ihatov08.github.io`;


/**
 * APIのベースURL
 * @type {string}
 */
const apiBaseUrl = `${baseUrl}/kimetsu_api/api`;


/**
 * APIの各JSONファイルURL
 * @type {{all: string, kisatsutai: string, hashira: string, oni: string}}
 */
const url = {
  all: `${apiBaseUrl}/all.json`,
  kisatsutai: `${apiBaseUrl}/kisatsutai.json`,
  hashira: `${apiBaseUrl}/hashira.json`,
  oni: `${apiBaseUrl}/oni.json`
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

export { baseUrl, url, fetchCharacters };
