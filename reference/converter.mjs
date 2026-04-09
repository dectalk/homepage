import {
  DECTALK_DURATIONS,
  HIRAGANA_MAP,
  IPA_MAP,
  IPA_VOWELS,
  KATAKANA_MAP,
  MIDI_TO_INDEX,
  ROMAJI_TO_IPA,
  XSAMPA_TO_IPA,
} from './data.mjs';

const IPA_VOWEL_SET = new Set(IPA_VOWELS);
const XSAMPA_ENTRIES = Object.entries(XSAMPA_TO_IPA).sort((a, b) => b[0].length - a[0].length);
const XSAMPA_INDICATORS = new Set(['@', '&', '3', '6', '8', '9', '0', '1', '2', '4', '5', '7']);
const IPA_CHARS = new Set(['ə', 'ɛ', 'ɪ', 'ɔ', 'ʃ', 'ʒ', 'θ', 'ð', 'ŋ', 'ɑ', 'æ', 'ʌ', 'ɜ', 'ɯ', 'ɾ', 'ɸ', 'ç', 'ɕ', 'ʑ']);

export class USTConverter {
  constructor(noteOffset = 0, options = {}) {
    this.tempo = 120.0;
    this.ticksPerBeat = 480;
    this.noteOffset = Number(noteOffset) || 0;
    this.phonemizer = options.phonemizer ?? null;
    this.stripLongSilences = Boolean(options.stripLongSilences);
    this.maxSilenceMs = Number.isFinite(options.maxSilenceMs) ? Number(options.maxSilenceMs) : 5000;
    this.strippedSilences = 0;
    this.unknownIPA = new Set();
    this.unknownLyrics = new Set();
    this.phonemizerLog = [];
    this.notationType = null;
    this.espeakAvailable = Boolean(this.phonemizer);
    this.notationCounts = {
      japanese: 0,
      xsampa: 0,
      english: 0,
      ipa: 0,
    };
  }

  detectNotationType(lyrics) {
    const uniqueLyrics = new Set();
    for (const lyric of lyrics) {
      const cleaned = lyric.trim().replace(/^-+|-+$/g, '').trim();
      if (cleaned && !['R', '-', '_'].includes(cleaned)) {
        uniqueLyrics.add(cleaned);
      }
    }

    if (uniqueLyrics.size === 0) {
      this.notationCounts = { japanese: 0, xsampa: 0, english: 0, ipa: 0 };
      return 'ipa';
    }

    let japaneseCount = 0;
    let xsampaCount = 0;
    let englishCount = 0;
    let ipaCount = 0;

    for (const lyric of uniqueLyrics) {
      if ([...lyric].some((c) => (c >= '\u3040' && c <= '\u309F') || (c >= '\u30A0' && c <= '\u30FF'))) {
        japaneseCount += 1;
        continue;
      }

      if ([...lyric].some((c) => XSAMPA_INDICATORS.has(c))) {
        xsampaCount += 1;
        continue;
      }

      if (/[A-Z]/.test(lyric) && /[a-z]/.test(lyric)) {
        xsampaCount += 1;
        continue;
      }

      const lower = lyric.toLowerCase();
      const xsampaDigraphs = ['dh', 'th', 'zh', 'sh', 'ch', 'dd', 'ng', 'nx', 'dz'];
      if (xsampaDigraphs.some((digraph) => lower.includes(digraph))) {
        xsampaCount += 1;
        continue;
      }

      if ([...lyric].some((c) => IPA_CHARS.has(c))) {
        ipaCount += 1;
        continue;
      }

      if (/^[A-Za-z]+$/.test(lyric) && lyric.length > 3) {
        const vowels = [...lyric.toLowerCase()].filter((c) => 'aeiou'.includes(c)).length;
        if (vowels >= lyric.length * 0.3) {
          englishCount += 1;
          continue;
        }
      }
    }

    this.notationCounts = {
      japanese: japaneseCount,
      xsampa: xsampaCount,
      english: englishCount,
      ipa: ipaCount,
    };

    return ['japanese', 'xsampa', 'english', 'ipa'].reduce((best, key) => {
      if (this.notationCounts[key] > this.notationCounts[best]) {
        return key;
      }
      return best;
    }, 'japanese');
  }

  xsampaToIpaConvert(xsampaString) {
    const result = [];
    let i = 0;

    while (i < xsampaString.length) {
      let matched = false;
      for (const [xsampa, ipa] of XSAMPA_ENTRIES) {
        if (xsampaString.slice(i, i + xsampa.length) === xsampa) {
          result.push(ipa);
          i += xsampa.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        result.push(xsampaString[i]);
        i += 1;
      }
    }

    return result.join('');
  }

  ipaToDectalk(ipaString) {
    const result = [];
    let i = 0;

    ipaString = ipaString.replace(/aːiː?/g, 'aɪ');
    ipaString = ipaString.replace(/aiː?/g, 'aɪ');

    while (i < ipaString.length) {
      if (i + 2 < ipaString.length) {
        const triple = ipaString.slice(i, i + 3);
        if (Object.prototype.hasOwnProperty.call(IPA_MAP, triple)) {
          const phoneme = IPA_MAP[triple];
          if (phoneme) {
            const isVowel = IPA_VOWEL_SET.has(triple);
            result.push([phoneme, isVowel]);
          }
          i += 3;
          continue;
        }
      }

      if (i + 1 < ipaString.length) {
        const double = ipaString.slice(i, i + 2);
        if (Object.prototype.hasOwnProperty.call(IPA_MAP, double)) {
          const phoneme = IPA_MAP[double];
          if (phoneme) {
            const isVowel = IPA_VOWEL_SET.has(double);
            result.push([phoneme, isVowel]);
          }
          i += 2;
          continue;
        }
      }

      const single = ipaString[i];
      if (Object.prototype.hasOwnProperty.call(IPA_MAP, single)) {
        const phoneme = IPA_MAP[single];
        if (phoneme) {
          const isVowel = IPA_VOWEL_SET.has(single);
          result.push([phoneme, isVowel]);
        }
      } else {
        this.unknownIPA.add(single);
      }

      i += 1;
    }

    return result;
  }

  parseUST(text) {
    const notes = [];
    let currentNote = {};
    let section = null;
    const allLyrics = [];

    for (let line of text.split(/\r?\n/)) {
      line = line.trim();
      if (line.startsWith('[')) {
        if (section && section.startsWith('#') && Object.keys(currentNote).length > 0) {
          notes.push({
            phoneme: currentNote.Lyric ?? '',
            note_num: Number.parseInt(currentNote.NoteNum ?? '60', 10),
            length: Number.parseInt(currentNote.Length ?? '480', 10),
            intensity: Number.parseInt(currentNote.Intensity ?? '100', 10),
          });
          allLyrics.push(currentNote.Lyric ?? '');
          currentNote = {};
        }
        section = line.slice(1, -1);
      } else if (line.includes('=') && section) {
        const idx = line.indexOf('=');
        const k = line.slice(0, idx);
        const v = line.slice(idx + 1);
        if (section === '#SETTING' && k === 'Tempo') {
          this.tempo = Number.parseFloat(v);
        } else {
          currentNote[k] = v;
        }
      }
    }

    if (Object.keys(currentNote).length > 0) {
      notes.push({
        phoneme: currentNote.Lyric ?? '',
        note_num: Number.parseInt(currentNote.NoteNum ?? '60', 10),
        length: Number.parseInt(currentNote.Length ?? '480', 10),
        intensity: Number.parseInt(currentNote.Intensity ?? '100', 10),
      });
      allLyrics.push(currentNote.Lyric ?? '');
    }

    this.notationType = this.detectNotationType(allLyrics);
    return notes;
  }

  compensateDuration(phoneme, requestedDur) {
    if (Object.prototype.hasOwnProperty.call(DECTALK_DURATIONS, phoneme)) {
      const [inherent, minimum] = DECTALK_DURATIONS[phoneme];
      if (requestedDur < inherent) {
        const overshoot = inherent - requestedDur;
        return Math.max(minimum, requestedDur - Math.floor(overshoot / 2));
      }
      return requestedDur;
    }
    return requestedDur;
  }

  ticksToMs(ticks) {
    const beats = ticks / this.ticksPerBeat;
    return Math.trunc((beats * 60000) / this.tempo);
  }

  midiToPitch(midiNote) {
    const shifted = midiNote + this.noteOffset;
    if (Object.prototype.hasOwnProperty.call(MIDI_TO_INDEX, shifted)) {
      return MIDI_TO_INDEX[shifted];
    }
    const hz = 440.0 * (2 ** ((shifted - 69) / 12));
    return Math.round(hz);
  }

  cleanEnglishLyric(lyric) {
    let cleaned = lyric.trim();
    if (['+', '*', '↑', '↓'].includes(cleaned)) {
      return '';
    }
    if (cleaned.includes(' ')) {
      let parts = cleaned.split(' ');
      parts = parts.filter((p) => !['-', 'R', '_'].includes(p));
      if (parts.length > 0) {
        cleaned = parts[parts.length - 1];
      }
    }
    return cleaned.replace(/^[-+*↑↓]+|[-+*↑↓]+$/g, '').trim();
  }

  lyricToIpa(lyric, englishIpaMap = null) {
    let cleaned = lyric.trim();

    if (['+', '*', '↑', '↓'].includes(cleaned)) {
      return '';
    }

    if (cleaned.includes(' ')) {
      let parts = cleaned.split(' ');
      parts = parts.filter((p) => !['-', 'R', '_'].includes(p));
      if (parts.length > 0) {
        if (this.notationType === 'xsampa') {
          const ipaParts = [];
          for (const part of parts) {
            const partCleaned = part.replace(/^[-+*↑↓]+|[-+*↑↓]+$/g, '').trim();
            if (partCleaned) {
              ipaParts.push(this.xsampaToIpaConvert(partCleaned));
            }
          }
          return ipaParts.join('');
        }
        cleaned = parts[parts.length - 1];
      }
    }

    cleaned = cleaned.replace(/^[-+*↑↓]+|[-+*↑↓]+$/g, '').trim();
    if (!cleaned) {
      return '';
    }

    if (this.notationType === 'japanese') {
      if (Object.prototype.hasOwnProperty.call(HIRAGANA_MAP, cleaned)) {
        const romaji = HIRAGANA_MAP[cleaned];
        if (Object.prototype.hasOwnProperty.call(ROMAJI_TO_IPA, romaji)) {
          return ROMAJI_TO_IPA[romaji];
        }
      }

      if (Object.prototype.hasOwnProperty.call(KATAKANA_MAP, cleaned)) {
        const romaji = KATAKANA_MAP[cleaned];
        if (Object.prototype.hasOwnProperty.call(ROMAJI_TO_IPA, romaji)) {
          return ROMAJI_TO_IPA[romaji];
        }
      }

      if (Object.prototype.hasOwnProperty.call(ROMAJI_TO_IPA, cleaned)) {
        return ROMAJI_TO_IPA[cleaned];
      }
    } else if (this.notationType === 'xsampa') {
      return this.xsampaToIpaConvert(cleaned);
    } else if (this.notationType === 'english') {
      if (englishIpaMap && Object.prototype.hasOwnProperty.call(englishIpaMap, cleaned)) {
        return englishIpaMap[cleaned];
      }
    } else if (this.notationType === 'ipa') {
      return cleaned;
    }

    if (!['R', '-', '_', ''].includes(cleaned)) {
      this.unknownLyrics.add(lyric);
    }

    return cleaned;
  }

  formatOutput(notes, englishIpaMap = null) {
    const result = [];

    for (const n of notes) {
      if (['R', '-', '_'].includes(n.phoneme)) {
        const dur = this.ticksToMs(n.length);
        if (this.stripLongSilences && dur > this.maxSilenceMs) {
          this.strippedSilences += 1;
          continue;
        }
        if (dur !== 0) {
          const pitch = this.midiToPitch(n.note_num);
          result.push(`[_<${dur},${pitch}>]`);
        }
        continue;
      }

      const ipa = this.lyricToIpa(n.phoneme, englishIpaMap);
      const dectalkPhonemes = this.ipaToDectalk(ipa);
      if (dectalkPhonemes.length === 0) {
        continue;
      }

      const totalDur = this.ticksToMs(n.length);
      const pitch = this.midiToPitch(n.note_num);
      const numPhonemes = dectalkPhonemes.length;
      const consonantMinDur = 60;
      const numVowels = dectalkPhonemes.filter(([, isVowel]) => isVowel).length;
      const numConsonants = numPhonemes - numVowels;

      if (numVowels > 0) {
        const consonantTotal = consonantMinDur * numConsonants;
        const vowelTotal = Math.max(0, totalDur - consonantTotal);
        const vowelDur = Math.floor(vowelTotal / numVowels);
        const vowelRemainder = vowelTotal % numVowels;

        let vowelCount = 0;
        dectalkPhonemes.forEach(([phoneme, isVowel], idx) => {
          const rawDur = isVowel
            ? vowelDur + (vowelCount < vowelRemainder ? 1 : 0)
            : consonantMinDur;
          if (isVowel) {
            vowelCount += 1;
          }
          const dur = this.compensateDuration(phoneme, rawDur);

          if (pitch > 37 && idx === 0) {
            result.push(`[_<0,${pitch}>][${phoneme}<${dur},${pitch}>]`);
          } else {
            result.push(`[${phoneme}<${dur},${pitch}>]`);
          }
        });
      } else {
        const durPerPhoneme = Math.floor(totalDur / numPhonemes);
        const remainder = totalDur % numPhonemes;

        dectalkPhonemes.forEach(([phoneme], idx) => {
          const rawDur = durPerPhoneme + (idx === numPhonemes - 1 ? remainder : 0);
          const dur = this.compensateDuration(phoneme, rawDur);

          if (pitch > 37 && idx === 0) {
            result.push(`[_<0,${pitch}>][${phoneme}<${dur},${pitch}>]`);
          } else {
            result.push(`[${phoneme}<${dur},${pitch}>]`);
          }
        });
      }
    }

    return result.join(' ');
  }

  convert(text) {
    const notes = this.parseUST(text);
    const output = this.formatOutput(notes, null);
    return {
      output,
      notationType: this.notationType,
      notationCounts: this.notationCounts,
      unknownLyrics: [...this.unknownLyrics].sort(),
      unknownIPA: [...this.unknownIPA].sort(),
      phonemizerLog: [...this.phonemizerLog],
      espeakAvailable: this.espeakAvailable,
      notesCount: notes.length,
      tempo: this.tempo,
      stripLongSilencesEnabled: this.stripLongSilences,
      maxSilenceMs: this.maxSilenceMs,
      strippedSilences: this.strippedSilences,
    };
  }

  async buildEnglishIpaMap(notes) {
    if (this.notationType !== 'english' || !this.phonemizer) {
      return {};
    }

    const unique = new Set();
    for (const note of notes) {
      const cleaned = this.cleanEnglishLyric(note.phoneme);
      if (cleaned && !['R', '-', '_'].includes(cleaned)) {
        unique.add(cleaned);
      }
    }

    const map = {};
    for (const lyric of unique) {
      try {
        const ipa = await this.phonemizer.phonemize(lyric);
        if (ipa) {
          map[lyric] = ipa;
          this.phonemizerLog.push([lyric, ipa]);
        } else {
          this.unknownLyrics.add(lyric);
        }
      } catch {
        this.unknownLyrics.add(lyric);
      }
    }

    this.espeakAvailable = true;
    return map;
  }

  async convertAsync(text) {
    const notes = this.parseUST(text);
    const englishIpaMap = await this.buildEnglishIpaMap(notes);
    const output = this.formatOutput(notes, englishIpaMap);
    return {
      output,
      notationType: this.notationType,
      notationCounts: this.notationCounts,
      unknownLyrics: [...this.unknownLyrics].sort(),
      unknownIPA: [...this.unknownIPA].sort(),
      phonemizerLog: [...this.phonemizerLog],
      espeakAvailable: this.espeakAvailable,
      notesCount: notes.length,
      tempo: this.tempo,
      stripLongSilencesEnabled: this.stripLongSilences,
      maxSilenceMs: this.maxSilenceMs,
      strippedSilences: this.strippedSilences,
    };
  }
}

export function decodeUSTBuffer(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const encodings = ['utf-8', 'shift-jis', 'windows-31j', 'latin1'];
  let lastError = null;

  for (const enc of encodings) {
    try {
      const decoder = new TextDecoder(enc, { fatal: true });
      return { text: decoder.decode(bytes), encoding: enc };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Could not decode file (${String(lastError)})`);
}

export function convertUSTText(text, noteOffset = 0, options = {}) {
  const converter = new USTConverter(noteOffset, options);
  const result = converter.convert(text);
  return {
    ...result,
    fullOutput: `[:phone on] ${result.output}`,
  };
}

export async function convertUSTTextAsync(text, noteOffset = 0, options = {}) {
  const converter = new USTConverter(noteOffset, options);
  const result = await converter.convertAsync(text);
  return {
    ...result,
    fullOutput: `[:phone on] ${result.output}`,
  };
}
