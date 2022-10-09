const RuleTester = require("eslint").RuleTester;
const rule = require("../../lib/rules/attributes-order");

const tester = new RuleTester({
  parser: require.resolve("@wd/wxml-parser"),
});

tester.run("attributes-order", rule, {
  valid: [
    {
      filename: "test.wxml",
      code: `<view wx:if="{{ condition }}">demo</view>`,
    },
    {
      filename: "test.wxml",
      code: `<view class="box" bindtap="tapHandler" />`,
    },
  ],
  invalid: [
    {
      filename: "test.wxml",
      code: `<view bindtap="tapHandler" class="box" wx:if="{{ condition }}" />`,
      output: `<view wx:if="{{ condition }}" class="box" bindtap="tapHandler" />`,
      errors: [`Attribute "class" should go before "bindtap"`],
    },
    {
      filename: "test.wxml",
      code: `<x-dialog bindbgtap="closeHandler" no-header/>`,
      output: `<x-dialog no-header bindbgtap="closeHandler"/>`,
      errors: [`Attribute "no-header" should go before "bindbgtap"`],
    },
  ],
});
