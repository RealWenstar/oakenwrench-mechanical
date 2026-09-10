import test from 'node:test';
import assert from 'node:assert/strict';
const motion = await import('../app/story/swipeMotion.mjs').catch(()=>({}));
test('motion is monotone, settles exactly and caps the middle speed surge',()=>{
  assert.equal(typeof motion.swipeEase,'function');
  assert.equal(motion.swipeEase(0),0);
  assert.equal(motion.swipeEase(1),1);
  let previous=0;
  for(let i=1;i<=1000;i++){
    const next=motion.swipeEase(i/1000);
    assert.ok(next>=previous);
    assert.ok((next-previous)*1000<1.34);
    previous=next;
  }
});
test('different shot lengths retain the same average source velocity in both directions',()=>{
  assert.equal(typeof motion.swipeDuration,'function');
  assert.equal(motion.swipeDuration(0.17,0.33),2200);
  assert.equal(motion.swipeDuration(0.33,0.17),2200);
  assert.equal(motion.swipeDuration(0.17,0.49),4400);
  assert.equal(motion.swipeDuration(0.17,0.33,0.8),1760);
  assert.equal(motion.swipeDuration(0.17,0.33,1.2),2640);
});
