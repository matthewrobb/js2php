/*global global, testSuite*/
testSuite('strings', function(assert) {

  testSuite('length', function() {
    var s = 'abcd';
    assert('ascii', s.length === 4);
    s = '↗Զ';
    assert('unicode', s.length === 2);
    assert('direct access', '↗Զ'.length === 2);
  });

  testSuite('charAt', function() {
    assert('ascii 0', 'abc'.charAt(0) === 'a');
    assert('ascii 1', 'abc'.charAt(1) === 'b');
    assert('unicode', '↗Զ'.charAt(1) === 'Զ');
  });

  testSuite('charCodeAt', function() {
    assert('ascii 0', 'abc'.charCodeAt(0) === 97);
    assert('ascii 1', 'abc'.charCodeAt(1) === 98);
    assert('unicode', '↗Զ'.charCodeAt(1) === 1334);
  });

  testSuite('split', function() {
    var s = 'abcdabCde';
    assert('basic', s.split('bc').join(',') === 'a,dabCde');
    assert('to chars', s.split('').join(',') === 'a,b,c,d,a,b,C,d,e');
    assert('regex', s.split(/a./).join(',') === ',cd,Cde');
  });

  testSuite('slice', function() {
    var s = 'abcdefghi';
    assert('one char slice', s.slice(0, 1) === 'a');
    assert('middle slice', s.slice(1, 3) === 'bc');
    assert('end slice', s.slice(2) === 'cdefghi');
    assert('neg start', s.slice(-2) === 'hi');
    assert('neg start, pos end', s.slice(-2, 8) === 'h');
    assert('neg start, neg end', s.slice(-2, -1) === 'h');
    assert('pos start, neg end', s.slice(1, -1) === 'bcdefgh');
  });

  testSuite('substr', function() {
    //todo
  });

  testSuite('substring', function() {
    //todo
  });

  testSuite('indexOf', function() {
    var s = 'abcdabCd';
    assert('at start', s.indexOf('ab') === 0);
    assert('in mid', s.indexOf('cd') === 2);
    assert('not found', s.indexOf('x') === -1);
    assert('use offset', s.indexOf('ab', 1) === 4);
    assert('case sensitive', s.indexOf('Cd') === 6);
  });


  testSuite('lastIndexOf', function() {
    var s = 'abcdabCd';
    assert('finds last', s.lastIndexOf('ab') === 4);
    assert('not found', s.lastIndexOf('x') === -1);
    assert('use offset', s.lastIndexOf('ab', 4) === 0);
    assert('case sensitive', s.lastIndexOf('cd') === 2);
  });

  testSuite('trim', function() {
    var s = ' \f\n\r\t\v\xA0abc\xA0\v\t\r\n\f ';
    assert('whitespace before and after', s.trim() === 'abc');
    s = ' \f\n\r\t\v\xA0';
    assert('all whitespace', s.trim() === '');
  });

  testSuite('toLowerCase', function() {
    assert('works on ascii and unicode', 'stÜüR '.toLowerCase() === 'stüür ');
    assert('does not change empty string', ''.toLowerCase() === '');
  });

  testSuite('toUpperCase', function() {
    assert('works on ascii and unicode', 'stÜüR '.toUpperCase() === 'STÜÜR ');
    assert('does not change empty string', ''.toUpperCase() === '');
  });

  testSuite('replace', function() {
    var s = 'abcdabCd';
    assert('at start', s.replace('ab', '__') === '__cdabCd');
    assert('in mid', s.replace('cd', '__') === 'ab__abCd');
    assert('case sensitive', s.replace('Cd', '__') === 'abcdab__');
    assert('regex single', s.replace(/ab/, '__') === '__cdabCd');
    assert('regex global', s.replace(/ab/g, '__') === '__cd__Cd');
    assert('regex insensitive', s.replace(/Cd/i, '__') === 'ab__abCd');
    assert('regex insensitive global', s.replace(/cd/ig, '__') === 'ab__ab__');
    assert('regex capture', s.replace(/(c)(.)/ig, '$1_') === 'abc_abC_');
    assert('regex capture 2', s.replace(/(c)(..)/ig, '$2') === 'abdabCd');
    var fn = function() {
      var args = [].slice.call(arguments);
      var last = args.pop();
      assert('last arg is full string', last === s);
      return '[' + args.join(',') + ']';
    };
    assert('string fn', s.replace('cd', fn) === 'ab[cd,2]abCd');
    assert('string fn case sensetive', s.replace('Cd', fn) === 'abcdab[Cd,6]');
    assert('regex fn single', s.replace(/ab/, fn) === '[ab,0]cdabCd');
    assert('regex fn global', s.replace(/ab/g, fn) === '[ab,0]cd[ab,4]Cd');
    assert('regex fn insensitive', s.replace(/Cd/i, fn) === 'ab[cd,2]abCd');
    assert('regex fn insensitive global', s.replace(/cd/ig, fn) === 'ab[cd,2]ab[Cd,6]');
    s = 'sstür';
    assert('regex fn unicode', s.replace(/t./, fn) === 'ss[tü,2]r');
    assert('regex fn unicode position', s.replace(/r/, fn) === 'sstü[r,4]');
    assert('regex fn unicode in regex', s.replace(/ü/, fn) === 'sst[ü,3]r');
  });

});
