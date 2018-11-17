// import diff_match_patch from '.diff-match-patch.js'
var diff_match_patch = require('./diff-match-patch.js')

class DS {
  // edit => text
    constructor(data = ''){
    this.default_data = data
    this.edit
    this.diff_value
    this.shadow = ''
    this.shadow_bak
    // this.client_var
    // this.server_ver
    this.my_ver = 0
    this.your_ver = 0
    this._dmp = new diff_match_patch()
  }
  
  // 1a, 1b
  diff_launch() {
    var ms_start = (new Date).getTime();
    var diff = this._dmp.diff_main(this.default_data, this.shadow, true);
    var ms_end = (new Date).getTime();
    if (diff.length > 2) {
      this._dmp.diff_cleanupSemantic(diff);
    }
    this.diff_value = diff;
    return diff;
    // var patch_list = this._dmp.patch_make(this.default_data, this.shadow, diff);
    // var patch_text = this._dmp.patch_toText(patch_list);
    // return patch_text
  }
  
  //2 
  diff_to_edit() {
    this.edit = this.diff_launch();
  }
  
  // 3
  copy_to_shadow() {
    this.my_ver ++;
    // copy
    this.shadow = this.default_data
  }

    add_version_to_edit() {
        var prev_edit = this.edit
        var result = Array()
        result.push(prev_edit)
        result.push(this.my_ver)
        result.push(this.your_ver)
        this.edit = result
    }

  
  // serverside
  patch_launch(diff_result) {
    var patch_list = this._dmp.patch_make(text1, text2, diff_result);
    patch_text = this._dmp.patch_toText(patch_list);
    var text1 = document.getElementById('text1b').value;
    var patches = this._dmp.patch_fromText(patch_text);
    var ms_start = (new Date).getTime();
    var results = this._dmp.patch_apply(patches, text1);
    var ms_end = (new Date).getTime();
  }
}

// export { DS as default }
module.exports = DS;
