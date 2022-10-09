const RuleTester = require("eslint").RuleTester;
const rule = require("../../lib/rules/mustache-interpolation-spacing");

const tester = new RuleTester({
  parser: require.resolve("@wd/wxml-parser"),
});

tester.run("mustache-interpolation-spacing", rule, {
  valid: [
    {
      filename: "test.wxml",
      code: `<view>{{ title }}</view>`,
    },
    {
      filename: "test.wxml",
      code: `<view class="{{ className }}">click</view>`,
    },
  ],
  invalid: [
    {
      filename: "test.wxml",
      code: `<view>{{title}}</view>`,
      errors: [{ messageId: "spacing" }],
      output: `<view>{{ title }}</view>`,
    },
    {
      filename: "test.wxml",
      code: `<view>{{ title}}</view>`,
      output: `<view>{{ title }}</view>`,
      errors: [{ messageId: "spacing" }],
    },
    {
      filename: "test.wxml",
      code: `<view>{{title }}</view>`,
      output: `<view>{{ title }}</view>`,
      errors: [{ messageId: "spacing" }],
    },
    {
      filename: "test.wxml",
      code: `<view class="{{className}}">click</view>`,
      output: `<view class="{{ className }}">click</view>`,
      errors: [{ messageId: "spacing" }],
    },
    {
      filename: "test.wxml",
      code: `<view class="{{ className}}">click</view>`,
      output: `<view class="{{ className }}">click</view>`,
      errors: [{ messageId: "spacing" }],
    },
    {
      filename: "test.wxml",
      code: `<view class="{{className }}">click</view>`,
      output: `<view class="{{ className }}">click</view>`,
      errors: [{ messageId: "spacing" }],
    },
  ],
});
