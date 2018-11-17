var DS = require('./ds.js')
var diff_match_patch = require('./diff-match-patch.js')

const assert = require('assert');

// var default_value_from_server = 'default';
const ds_without_data = new DS();

var dmp = new diff_match_patch()

assert.equal(typeof(ds_without_data), 'object')
assert.equal(ds_without_data.__proto__, DS.prototype)

ds_without_data.diff_launch()
var diff = dmp.diff_main(ds_without_data.default_data, ds_without_data.shadow, true);
var diff = dmp.diff_main('data', 'data', true);

// assert.equal(ds_without_data.diff_value, diff)

// assert.equal(ds_with_data.edit, default_value_from_server)


const ds_with_data = new DS('data');
assert.equal(typeof(ds_with_data), 'object')
assert.equal(ds_with_data.__proto__, DS.prototype)
assert.equal(ds_with_data.default_data, 'data')
assert.equal(ds_with_data.my_ver, 0)

var result = ds_with_data.diff_launch()
var diff = dmp.diff_main(ds_with_data.default_data, ds_with_data.shadow, true);
// assert.equal(ds_with_data.diff_value, diff)
// assert.equal(result, undefined)

// 2
ds_with_data.diff_to_edit()
assert.equal(ds_with_data.edit.length, result.length)

// 3 
assert.notEqual(ds_with_data.diff_value, ds_with_data.shadow)
ds_with_data.copy_to_shadow()
assert.equal(ds_with_data.default_data, 'data')
assert.equal(ds_with_data.default_data, ds_with_data.shadow)
assert.equal(ds_with_data.my_ver, 1)

// edit 객체 수정
ds_with_data.add_version_to_edit()
// [{}, v1, v2]
assert.equal(ds_with_data.edit[1], 1)
assert.equal(ds_with_data.edit[2], 0)

// 유효성검사
// ds_with_data.

// patch
// ds_with_data.patch_launch()

console.log('success');

