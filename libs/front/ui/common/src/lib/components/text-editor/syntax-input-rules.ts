import { InputRule } from 'prosemirror-inputrules';

const emDashInputRule = new InputRule(/--$/, '—', {
  inCodeMark: false,
  undoable: true,
});
const ellipsisInputRule = new InputRule(/\.{3}\s$/, '…', {
  inCodeMark: false,
  undoable: true,
});
const openingQuoteInputRule = new InputRule(/<{2}\s$/, '« ', {
  inCodeMark: false,
  undoable: true,
});
const closingQuoteInputRule = new InputRule(/\s>{2}$/, ' »', {
  inCodeMark: false,
  undoable: true,
});

export const syntaxInputRules = [
  emDashInputRule,
  ellipsisInputRule,
  openingQuoteInputRule,
  closingQuoteInputRule,
];
