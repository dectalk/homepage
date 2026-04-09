import { convertUSTText, convertUSTTextAsync, decodeUSTBuffer } from './converter.mjs';
import { createEspeakWasmPhonemizer } from './espeak-wasm.mjs';

const fileInput = document.getElementById('ustFile');
const offsetInput = document.getElementById('noteOffset');
const convertBtn = document.getElementById('convertBtn');
const outputEl = document.getElementById('output');
const detailsEl = document.getElementById('details');
const statusEl = document.getElementById('status');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const openBytesizedfoxBtn = document.getElementById('openBytesizedfoxBtn');
const useEspeakInput = document.getElementById('useEspeak');
const stripLongSilencesInput = document.getElementById('stripLongSilences');
const sharedEspeakPhonemizer = createEspeakWasmPhonemizer();

let latestOutput = '';
const bytesizedfoxBaseUrl = 'https://bytesizedfox.dev/';

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.dataset.state = isError ? 'error' : 'ok';
}

function renderDetails(result, fileName, encoding, espeakNote = '') {
  const lines = [];
  lines.push(`File: ${fileName}`);
  lines.push(`Decoded as: ${encoding}`);
  lines.push(`Notes: ${result.notesCount}`);
  lines.push(`Tempo: ${result.tempo}`);
  lines.push(`Detected notation: ${result.notationType}`);
  lines.push(
    `Notation scores - Japanese: ${result.notationCounts.japanese}, X-SAMPA: ${result.notationCounts.xsampa}, English: ${result.notationCounts.english}, IPA: ${result.notationCounts.ipa}`,
  );
  if (result.stripLongSilencesEnabled) {
    lines.push(
      `Long silence stripping: enabled (>${result.maxSilenceMs} ms), removed ${result.strippedSilences} silence note(s)`,
    );
  } else {
    lines.push('Long silence stripping: disabled');
  }

  if (espeakNote) {
    lines.push(espeakNote);
  } else if (!result.espeakAvailable) {
    lines.push('English phonemizer: disabled (client-only build, no espeak-ng runtime)');
  }

  if (result.unknownLyrics.length > 0) {
    lines.push(`Unknown lyrics (${result.unknownLyrics.length}): ${result.unknownLyrics.join(', ')}`);
  }

  if (result.unknownIPA.length > 0) {
    lines.push(`Unknown IPA chars (${result.unknownIPA.length}): ${result.unknownIPA.join(', ')}`);
  }

  detailsEl.textContent = lines.join('\n');
}

async function handleConvert() {
  const file = fileInput.files?.[0];
  if (!file) {
    setStatus('Select a .ust file first.', true);
    return;
  }

  const noteOffset = Number.parseInt(offsetInput.value, 10);
  if (Number.isNaN(noteOffset)) {
    setStatus('Note offset must be an integer.', true);
    return;
  }

  const useEspeak = Boolean(useEspeakInput?.checked);
  const stripLongSilences = Boolean(stripLongSilencesInput?.checked);
  const conversionOptions = { stripLongSilences, maxSilenceMs: 5000 };
  setStatus(useEspeak ? 'Converting (loading espeak-ng WASM)...' : 'Converting...');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { text, encoding } = decodeUSTBuffer(arrayBuffer);
    let espeakNote = '';
    let result;
    if (useEspeak) {
      try {
        result = await convertUSTTextAsync(text, noteOffset, {
          ...conversionOptions,
          phonemizer: sharedEspeakPhonemizer,
        });
        espeakNote = 'English phonemizer: enabled (espeak-ng WASM)';
      } catch (espeakErr) {
        result = convertUSTText(text, noteOffset, conversionOptions);
        espeakNote = `English phonemizer fallback: espeak-ng WASM failed (${String(espeakErr)})`;
      }
    } else {
      result = convertUSTText(text, noteOffset, conversionOptions);
    }

    latestOutput = result.fullOutput;
    outputEl.value = latestOutput;
    if (openBytesizedfoxBtn) {
      openBytesizedfoxBtn.disabled = false;
    }
    renderDetails(result, file.name, encoding, espeakNote);
    setStatus(useEspeak ? 'Conversion complete (espeak-ng WASM enabled).' : 'Conversion complete.');
  } catch (err) {
    latestOutput = '';
    outputEl.value = '';
    if (openBytesizedfoxBtn) {
      openBytesizedfoxBtn.disabled = true;
    }
    detailsEl.textContent = '';
    setStatus(`Conversion failed: ${String(err)}`, true);
  }
}

async function copyOutput() {
  if (!latestOutput) {
    setStatus('No output to copy.', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(latestOutput);
    setStatus('Output copied to clipboard.');
  } catch (err) {
    setStatus(`Clipboard copy failed: ${String(err)}`, true);
  }
}

function downloadOutput() {
  if (!latestOutput) {
    setStatus('No output to download.', true);
    return;
  }

  const blob = new Blob([latestOutput + '\n'], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sourceName = fileInput.files?.[0]?.name ?? 'converted';
  a.href = url;
  a.download = `${sourceName.replace(/\.ust$/i, '')}.dectalk.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  setStatus('Output downloaded.');
}

function openInBytesizedfox() {
  if (!latestOutput) {
    setStatus('No output to open.', true);
    return;
  }

  const target = `${bytesizedfoxBaseUrl}#text=${encodeURIComponent(latestOutput)}`;
  window.open(target, '_blank', 'noopener,noreferrer');
  setStatus('Opened bytesizedfox.dev in a new tab.');
}

convertBtn.addEventListener('click', handleConvert);
copyBtn.addEventListener('click', copyOutput);
downloadBtn.addEventListener('click', downloadOutput);
if (openBytesizedfoxBtn) {
  openBytesizedfoxBtn.addEventListener('click', openInBytesizedfox);
}
