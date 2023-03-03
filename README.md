# PostCSS pseudo shorthand

[PostCSS](https://github.com/postcss/postcss) plugin that expands pseudo
aliases to browser specific aliases, to avoid writing the same CSS rules
multiple times.

**Example input**

```css
input[range]::range-thumb {
  background: green;
}
```

**Example output**

```css
input[range]::-moz-range-thumb {
  background: green;
}
input[range]::-ms-thumb {
  background: green;
}
input[range]::-webkit-slider-thumb {
  background: green;
}
```

## Usage

The example usage below has the default rules documented. More rules can be
added without any majort version bump.

```js
import postcssPseudoShorthand from 'postcss-pseudo-shorthand';

const config = {
  plugins: [
    postcssPseudoShortHand({
      rules: {
        '::color-swatch': ['::-moz-color-swatch', '::-webkit-color-swatch'],
        '::color-swatch-wrapper': ['::-moz-focus-inner', '::-webkit-color-swatch-wrapper'],
        '::range-thumb': ['::-moz-range-thumb', '::-ms-thumb', '::-webkit-slider-thumb'],
        '::range-track': ['::-moz-range-track', '::-ms-track', '::-webkit-slider-runnable-track'],
      },
    }),
  ],
};

export default config;
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your
environment.

***

MIT © [Jan Henning Thorsen](https://thorsen.pm)
