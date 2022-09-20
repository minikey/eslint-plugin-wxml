module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "",
      categories: [],
      url: "",
    },
    fixable: "whitespace",
    schema: [{
      enum: ['always', 'never'],
    }],
    messages: {
      spacing: "Expected 1 space before '{{' and after '}}'",
    },
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    const set = new WeakSet();
    function interpolation(node) {
      if (node && !set.has(node) && node.rawValue) {
        set.add(node);
        if (!/^\{\{\s+.+\s+\}\}$/.test(node.rawValue)) {
          context.report({
            node,
            messageId: "spacing",
            fix(fixer) {
              const val = node.rawValue.replace(/(?:^\{\{)|(?:\}\}$)/g, '').trim();
              const start = node.range[0];
              const end = node.range[1] + 1;
              return fixer.replaceTextRange([ start, end ], `{{ ${ val } }}`);
            },
          });
        }
      }
    }
    return {
      WXElement(node) {
        if (node.startTag && node.startTag.attributes) {
          node.startTag.attributes.forEach(attr => {
            if (attr && attr.interpolations && attr.interpolations.length) {
              attr.interpolations.forEach(iNode => {
                interpolation(iNode);
              });
            }
          });
        }
      },
      WXInterpolation: interpolation,
    };
  },
};
