//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const QUOTE_SETTINGS = {
  single: {
    quote: "'",
    description: "singlequote",
  },
  double: {
    quote: '"',
    description: "doublequote",
  },
};

module.exports = {
  /** @type {import('eslint').Rule.RuleMetaData} */
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce the consistent use of either double, or single quotes",
      categories: [],
      url: "https://eslint-plugin-wxml.js.org/rules/quotes.html",
    },
    fixable: "code",
    messages: {
      wrongQuotes: "attributes value must use {{description}} to wrap",
    },
    schema: [
      {
        enum: ["single", "double"],
      },
    ],
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    const config = context.options || [];
    const targetQuoteConfig = QUOTE_SETTINGS[config[0]];
    return {
      WXAttribute(node) {
        if (
          config[0] &&
          node &&
          node.quote &&
          node.quote !== targetQuoteConfig.quote
        ) {
          context.report({
            node,
            messageId: "wrongQuotes",
            data: {
              description: QUOTE_SETTINGS[config[0]].description,
            },
            fix(fixer) {
              const result = `${node.key}=${targetQuoteConfig.quote}${node.value}${targetQuoteConfig.quote}`;
              return fixer.replaceTextRange(node.range, result);
            },
          });
        }
      },
    };
  },
};
