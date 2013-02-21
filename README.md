## About mongoose-allocate

Plugin for add padding to [mongoose][] documents, main use case is for capped collections.

## How it works

It uses [mongoose][] `save` hook event to add a padding field `__p` (with a large string)
the first time a document is created in a collection.

## Install

npm install mongoose-allocate

## Usage

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var allocatePlugin = require('mongoose-allocate');

...

// This is a capped collection
var MySchema = new Schema({
  ...
}, { capped: { size: 1000, max: 5, autoIndexId: true } }));

...

MySchema.plugin(allocatePlugin, {len: 512, char: 'x'});

...

var MyModel = db.model('MyModel', MySchema);
```

## Options

    // Default options
    {
        // padding length
        len: 256,

        // padding character
        char: '0',

        // padding field name
        fieldName: '__p'
    }

## Test

    // Run
    $ mocha

[Mocha][] is needed for runing the test


## License

Copyright (c) 2013 Jonathan brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[mongoose]: http://mongoosejs.com
[Mocha]: http://visionmedia.github.com/mocha/
[repository]: http://github.com/cayasso/mongoose-allocate
