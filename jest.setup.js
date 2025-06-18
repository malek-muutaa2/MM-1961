require("@testing-library/jest-dom");
//
require("jest-fetch-mock").enableMocks();
require("dotenv").config();

import "resize-observer-polyfill";
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// 2) Stub ResizeObserver so disconnect(), observe(), unobserve() exist
class ResizeObserver {
  constructor(callback) {
    // you can capture `callback` if you need to simulate resizes later
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

global.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  }),
};
