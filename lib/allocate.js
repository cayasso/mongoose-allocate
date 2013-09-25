module.exports = function setup (schema, options) {
    
  options = options || {};

  var o = {
    len: options.len || 256,
    char: options.char || '0',
    fieldName: options.fieldName || '__p'
  };

  var isPadded = false;
  var pad = getString();
      
  /**
   * Create the padding field
   */

  function createField () {
    var field = {};
    field[o.fieldName] = {'type': String, 'default': ''};
    return field;
  }

  /**
   * Add padding
   */

  function addPadding (next) {
    if (this.isNew) {
      this[o.fieldName] = pad;
    }
    next();
  }

  /**
   * Remove padding
   */

  function removePadding (doc) {
    if (doc[o.fieldName] === pad) {
      var d = {}, q = { _id: doc._id };
      d[o.fieldName] = '';
      doc.constructor.findOneAndUpdate(q, d, function (err, doc) {
        if (err) console.log(err);
      });
    }
  }

  /**
   * Get current settings
   */

  function getSettings () {
    return o;
  }

  /**
   * Create pad string
   */

  function getString () {
    var s = '', c = o.char.toString();
    for (var i = 0; i < o.len; i++) s += c;
    return s;
  }

  schema.add(createField());
  schema.pre('save', addPadding);
  schema.post('save', removePadding);
  schema.statics.getPaddingSettings = getSettings;
  schema.methods.getPaddingSettings = getSettings;
};
