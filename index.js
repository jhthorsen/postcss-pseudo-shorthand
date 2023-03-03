import parser from 'postcss-selector-parser';

const defaultRules = {
  '::range-thumb': ['::-moz-range-thumb', '::-ms-thumb', '::-webkit-slider-thumb'],
  '::range-track': ['::-moz-range-track', '::-ms-track', '::-webkit-slider-runnable-track'],
};

const postcssPseudoShorthand = (opts = {}) => {
  const pseudoRules = opts.rules || defaultRules;
  const pseudoRe = new RegExp('(' + Object.keys(pseudoRules).sort().join('|') + ')');

  return {
    postcssPlugin: 'postcss-pseudo-shorthand',
    Rule(rule, _params) {
      if (!pseudoRe.test(rule.selector)) return;

      let remove = false;
      const parserObject = parser((selectors) => {
        selectors.each((selector) => {
          selector.walkPseudos((pseudo) => {
            for (const realName of (pseudoRules[pseudo.value] || [])) {
              pseudo.value = realName;
              rule.cloneBefore({selector: selector.toString()});
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
