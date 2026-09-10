import test from 'node:test';
import assert from 'node:assert/strict';
import {canEnterStory} from '../app/story/loading.mjs';

test('first decoded frame enters immediately without an artificial minimum dwell',()=>{
  assert.equal(canEnterStory({bufferProgress:0.01,mediaFailed:false,mediaReady:true,minimumWaitElapsed:false,timedOut:false}),true);
});
test('buffered bytes alone never mean a frame is ready',()=>{
  assert.equal(canEnterStory({bufferProgress:1,mediaFailed:false,mediaReady:false,minimumWaitElapsed:true,timedOut:false}),false);
});
test('failed media exits immediately to the poster fallback',()=>{
  assert.equal(canEnterStory({bufferProgress:0,mediaFailed:true,mediaReady:false,minimumWaitElapsed:false,timedOut:false}),true);
});
