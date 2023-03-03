import t from 'tap';
import postcss from 'postcss';
import postcssPseudoShorthand from '../index.js';

const transform = (input, opts = {}) => postcss([postcssPseudoShorthand(opts)]).process(input);
const trim = (str) => str.replace(/\s+/g, '');

t.test('return original', async t => {
  const input = 'a { background: blue; }';
  const res = await transform(input);
  t.same(res.css, input);
});

t.test('transform defaults - without tag', async (t) => {
  const res = await transform('::range-thumb { background: blue; }');
  t.same(res.css.split(/\r?\n/).map(trim), [
    '::-moz-range-thumb{background:blue;}',
    '::-ms-thumb{background:blue;}',
    '::-webkit-slider-thumb{background:blue;}',
  ]);
});

t.test('transform defaults - with tag', async (t) => {
  const res = await transform('input[range]::range-thumb, input::range-track { background: green; }');

  t.same(res.css.split(/\r?\n/).map(trim), [
    'input[range]::-moz-range-thumb{background:green;}',
    'input[range]::-ms-thumb{background:green;}',
    'input[range]::-webkit-slider-thumb{background:green;}',
    'input::-moz-range-track{background:green;}',
    'input::-ms-track{background:green;}',
    'input::-webkit-slider-runnable-track{background:green;}',
  ]);
});

t.test('transform custom', async (t) => {
  const rules = {
    '::range-thumb': ['::-moz-range-thumb'],
    '::cool': ['::-moz-cool'],
  };

  const res = await transform('a::cool { color: green; }', {rules});
  t.same(trim(res.css), 'a::-moz-cool{color:green;}');
});
