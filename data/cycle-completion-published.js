// Published only after independent review of each language and response format.
import { earlyPilot } from './cycle-completion/early-pilot.js';
import { earlySecond } from './cycle-completion/early-2.js';
import { earlyThird } from './cycle-completion/early-3.js';

export const cyclePublications = [
  { ...{"id":"early-pilot","edition":"v1.66","date":"2026-11-27","reviewer":"review_first_cycle_pilot","source":"data/cycle-completion/early-pilot.js","sha256":"04a8edbe804c2ff532878d6a9fd90d08771f2a4656b363081a4b328d678f9b16"}, adaptations: earlyPilot },
  { ...{"id":"early-2","edition":"v1.66.1","date":"2026-11-27","reviewer":"review_first_cycle_pilot","source":"data/cycle-completion/early-2.js","sha256":"2ecc87190867898bd53e7c36613766fb1cf09dd53a845e69066fb9fd7fe3e5bc"}, adaptations: earlySecond },
  { ...{"id":"early-3","edition":"v1.66.1","date":"2026-11-27","reviewer":"review_first_cycle_pilot","source":"data/cycle-completion/early-3.js","sha256":"8093eabf0801b631a99d3af9124f546831d1e899a0793e6abdedaf5ec6932ba9"}, adaptations: earlyThird },
];
