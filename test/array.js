/*global global, testSuite, Buffer*/
testSuite('array', function(assert) {

  testSuite('constructor', function() {
    var a = new Array(5);
    assert('specify length', a.length === 5);
    assert('is empty', a.join('').length === 0);
    var b = new Array('5');
    assert('specify element', b.length === 1);
    assert('join', b.join() === '5');
  });


  testSuite('forEach', function() {
    var a = new Array(5);
    var count = 0;
    a.forEach(function(el) {
      count += 1;
    });
    assert('not called on unset elements', count === 0);
    var b = [false, undefined, null, [], 1];
    b.forEach(function(el) {
      count += 1;
    });
    assert('is called on other elements', count === 5);
  });


  testSuite('push', function() {
    var a = ['a', 'b', 'c'];
    assert('can push', a.push('d') === 4 && a.join('') === 'abcd');
    assert('can push multiple', a.push('e', 'f') === 6 && a.join('') === 'abcdef');
    a.length = 0;
    assert('can push using apply', Array.prototype.push.apply(a, 'asdf'.split('')) === 4 && a.join('') === 'asdf');
  });


  testSuite('pop', function() {
    var a = ['a', 'b', 'c'];
    assert('can pop', a.pop() === 'c');
    assert('has new length', a.length === 2);
    assert('old index is empty', a[2] === undefined && !(2 in a));
  });


  testSuite('unshift', function() {
    var a = ['a', 'b', 'c'];
    assert('can unshift', a.unshift('x') === 4 && a.join('') === 'xabc');
    assert('can unshift multiple', a.unshift('1', '2') === 6 && a.join('') === '12xabc');
    a.length = 0;
    assert('can unshift using apply', Array.prototype.unshift.apply(a, 'asdf'.split('')) === 4 && a.join('') === 'asdf');
  });


  testSuite('shift', function() {
    var a = ['a', ,'c','d'];
    assert('hole present in array', (1 in a) === false);
    assert('can shift', a.shift() === 'a');
    assert('has new length', a.length === 3);
    assert('old last element is empty', a[3] === undefined && !(3 in a));
    assert('hole present at new location', (0 in a) === false);
  });


  testSuite('slice', function() {
    var a = 'abcdefghi'.split('');
    assert('length', a.length === 9);
    assert('one char slice', a.slice(0, 1).join('') === 'a');
    assert('middle slice', a.slice(1, 3).join('') === 'bc');
    assert('end slice', a.slice(2).join('') === 'cdefghi');
    assert('neg start', a.slice(-2).join('') === 'hi');
    assert('neg start, pos end', a.slice(-2, 8).join('') === 'h');
    assert('neg start, neg end', a.slice(-2, -1).join('') === 'h');
    assert('pos start, neg end', a.slice(1, -1).join('') === 'bcdefgh');
    assert('pos too large', a.slice(11).join('') === '');
  });


  testSuite('indexOf', function() {
    var a = '123123'.split('');
    assert('finds first', a.indexOf('2') === 1);
    assert('not found', a.indexOf('a') === -1);
    assert('finds exact', a.indexOf(2) === -1);
  });


  testSuite('lastIndexOf', function() {
    var a = '123123'.split('');
    assert('finds last', a.lastIndexOf('2') === 4);
    assert('not found', a.lastIndexOf('a') === -1);
    assert('finds exact', a.lastIndexOf(2) === -1);
  });


  testSuite('sort', function() {
    var a = 'iabgcdehf'.split('');
    var b = a.sort();
    assert('sorts in place', a === b);
    assert('is sorted', a.join('') === 'abcdefghi');
    a = [new Error('i'), new Error('j'), new Error('h')];
    b = a.slice(0);
    a.sort(function(a, b) {
      return a.message.localeCompare(b.message);
    });
    assert('function sort', a[0] === b[2] && a[1] === b[0] && a[2] === b[1]);
  });

});
