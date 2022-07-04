import { Llama } from './llama.type';

// 這個用來產生假資料的函式，不要有其他的邏輯，就是單純的資料。不要有任何 dependency。
// 檔案與函式名稱都有「fake」字樣強調，千萬不能用在 production 環境。
export function createFakeLlama(override?: Partial<Llama>) {
  return {
    id: 'FAKE LLAMA ID',
    name: 'FAKE NAME',
    imageFileName: 'FAKE IMAGE',
    ...override, // 若有 override 內容，就會覆寫上面的內容
  };
}
