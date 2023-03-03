import parser from 'postcss-selector-parser';

const defaultRules = {
  '::color-swatch': ['::-moz-color-swatch', '::-webkit-color-swatch'],
  '::color-swatch-wrapper': ['::-moz-focus-inner', '::-webkit-color-swatch-wrapper'],
  '::file-selector-button': ['::-ms-browse', '::-webkit-file-upload-button', '::file-selector-button'],
  '::range-thumb': ['::-moz-range-thumb', '::-ms-thumb', '::-webkit-slider-thumb'],
  '::range-track': ['::-moz-range-track', '::-ms-track', '::-webkit-slider-runnable-track'],
};

const postcssPseudoShorthand = (opts = {}) => {
  const isCloned = Symbol();
  const pseudoRules = opts.rules || defaultRules;
  const pseudoRe = new RegExp('(' + Object.keys(pseudoRules).sort().join('|') + ')');

  return {
    postcssPlugin: 'postcss-pseudo-shorthand',
    Rule(rule, _params) {
      if (!pseudoRe.test(rule.selector)) return;
      if (rule[isCloned]) return;

      let remove = false;
      const parserObject = parser((selectors) => {
        selectors.each((selector) => {
          selector.walkPseudos((pseudo) => {
            for (const realName of (pseudoRules[pseudo.value] || [])) {
              pseudo.value = realName;
              const cloned = rule.cloneBefore({selector: selector.toString()});
              cloned[isCloned] = true;
              remove = true;
            }
          });
        });
      });

      parserObject.process(rule.selector);
      if (remove) rule.remove();
    },
  };
}

postcssPseudoShorthand.postcss = true;

export default postcssPseudoShorthand;
