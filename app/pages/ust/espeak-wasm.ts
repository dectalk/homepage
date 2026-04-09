const ESPEAK_JS_URL = 'https://cdn.jsdelivr.net/npm/espeak-ng@1.0.2/dist/espeak-ng.js';
const ESPEAK_WASM_URL = 'https://cdn.jsdelivr.net/npm/espeak-ng@1.0.2/dist/espeak-ng.wasm';

let modulePromise: Promise<any> | null = null;
let wasmBinaryPromise: Promise<Uint8Array> | null = null;
const globalPhonemeCache = new Map<string, string>();

async function loadEspeakModule() {
  if (!modulePromise) {
    // @ts-ignore
    modulePromise = import(ESPEAK_JS_URL).then((mod) => mod.default ?? mod.ESpeakNG ?? mod);
  }
  return modulePromise;
}

async function loadWasmBinary() {
  if (!wasmBinaryPromise) {
    wasmBinaryPromise = fetch(ESPEAK_WASM_URL).then(async (resp) => {
      if (!resp.ok) {
        throw new Error(`Failed to download espeak-ng.wasm (${resp.status})`);
      }
      return new Uint8Array(await resp.arrayBuffer());
    });
  }
  return wasmBinaryPromise;
}

export interface EspeakPhonemizer {
  phonemize(text: string): Promise<string>;
}

export function createEspeakWasmPhonemizer(): EspeakPhonemizer {
  return {
    async phonemize(text: string) {
      const key = String(text);
      if (globalPhonemeCache.has(key)) {
        return globalPhonemeCache.get(key)!;
      }

      const [ESpeakNg, wasmBinary] = await Promise.all([loadEspeakModule(), loadWasmBinary()]);
      const instance = await ESpeakNg({
        wasmBinary,
        locateFile: (path: string) => (path.endsWith('.wasm') ? ESPEAK_WASM_URL : path),
        arguments: ['--phonout', 'generated', '--sep=', '-q', '-b=1', '--ipa=3', '-v', 'en-us', key],
        print: () => {},
        printErr: () => {},
      });

      const raw = instance.FS.readFile('generated', { encoding: 'utf8' }) as string;
      const ipa = raw.trim().replace(/[ˈˌ\s]/g, '');
      globalPhonemeCache.set(key, ipa);
      return ipa;
    },
  };
}
