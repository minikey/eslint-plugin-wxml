const defineList = [
  {
    type: 'LIST_RENDERING',
    keys: ['wx:for'],
  },
  {
    type: 'CONDITIONALS',
    keys: ['wx:if', 'wx:elif', 'wx:else', 'hidden'],
  },
  {
    type: 'GLOBAL',
    keys: ['id', 'class'],
  },
  {
    type: 'EVENTS',
    keys: [/^bind:?/, /^capture-bind:?/, /^catch:?/, /^capture-catch:?/, /^mut-bind:?/]
  },
  {
    type: 'OTHER_ATTR',
    keys: null,
  },
];

const orderedGroupList = ['LIST_RENDERING', 'CONDITIONALS', 'GLOBAL', 'OTHER_ATTR', 'EVENTS'];
const orderedGroupMap = orderedGroupList.reduce((map, key, index) => {
  map[key] = {
    index,
    config: defineList.find(item => {
      return item.type === key;
    }),
  };
  return map;
}, {});

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce order of attributes",
      categories: [],
      url: "",
    },
    fixable: 'code',
    schema: [],
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    const defaultType = 'OTHER_ATTR';

    return {
      "WXElement"(node) {
        const attributes = node.startTag && node.startTag.attributes;
        if (attributes && attributes.length > 1) {
          const list = attributes.map(attr => {
            let target = null;
            let tIndex = 0;
            if (defineList.slice(0, -1).some(item => {
              if (item.keys.some((key, idx) => {
                let flag = false;
                const rKey = attr.key.toLowerCase();
                if (typeof key === 'string') {
                  flag = rKey === key;
                } else if (key.test(rKey)) {
                  flag = true;
                }
                if (flag) {
                  target = item;
                  tIndex = idx;
                }
                return flag;
              })) {
                return true;
              }
            })) {
              return {
                attr,
                type: target.type,
                order: `${ orderedGroupMap[target.type].index }.${ tIndex }`,
              };
            } else {
              return {
                attr,
                type: defaultType,
                order: orderedGroupMap[defaultType].index,
              };
            }
          });
          for (let i = 0, len = list.length - 1; i < len; i++) {
            const curNode = list[i];
            for (let n = i + 1; n < list.length; n++) {
              const nextNode = list[n];
              if (nextNode.order < curNode.order) {
                context.report({
                  node,
                  message: `Attribute "${ nextNode.attr.key }" should go before "${ curNode.attr.key }"`,
                  fix(fixer) {
                    const sortedList = list.slice(0).sort((prev, next) => {
                      const diff = prev.order - next.order;
                      if (diff === 0) {
                        return 0;
                      } else if (diff > 0) {
                        return 1;
                      } else {
                        return -1;
                      }
                    });
                    const result = []
                    for (let i = 0, len = sortedList.length; i < len; i++) {
                      const curAttr = sortedList[i].attr;
                      const oldAttr = list[i].attr;
                      if (curAttr != oldAttr) {
                        let range = [oldAttr.range[0], oldAttr.range[1] + 1];
                        let text = curAttr.quote ? `${ curAttr.key }=${ curAttr.quote }${ curAttr.value }${ curAttr.quote }` : `${ curAttr.key }`;
                        result.push(fixer.replaceTextRange(range, text));
                      }
                    }
                    return result;
                  },
                });
                return;
              }
            }
          }
        }
      },
    };
  },
};
