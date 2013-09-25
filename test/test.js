var mongooseAllocate = require('../');
var mongoose = require('mongoose');
var expect = require('expect.js');
var Schema = mongoose.Schema;
var Model;
var schema;
var db;

describe('mongoose-allocate', function () {

  before(function (done) {
    // connecting to mongoose
    mongoose.connect('mongodb://127.0.0.1/mongoose-allocate-testing');

    db = mongoose.connection;

    db.on('error', function (err) {
      done(err);
    });

    db.once('open', done);
  });

  after(function (done) {
    db.db.dropDatabase();
    done();
  });

  it ('should fail without the plugin applied', function (done) {
    schema = new Schema({
      title1: String,
      title2: String,
      title3: String
    }, { capped: { size: 1000, max: 5, autoIndexId: true } });
    
    Model = mongoose.model('M1', schema);

    Model.create({
      title1: 'T'
    }, function (err, doc) {
      if (err) return done(err);
      doc.title1 = 'TTT';
      doc.title2 = 'xxxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxxxx',
      doc.save(function (_err, _doc) {
        expect(_err).to.be.ok();
        done();
      });
    });
  });

  it ('should not fail with the plugin applied', function (done) {
    schema = new Schema({
      title1: String,
      title2: String,
      title3: String
    }, { capped: { size: 1000, max: 5, autoIndexId: true } });
    
    // Applying plugin
    schema.plugin(mongooseAllocate);
  
    Model = mongoose.model('M2', schema);

    Model.create({
      title1: 'T'
    }, function (err, doc) {
      if (err) return done(err);
      doc.title1 = 'TTTTTTTTT';
      doc.title2 = 'xxxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxxxx',
      doc.save(function (_err, _doc) {
        if (err) return done(_err);
        expect(_doc).to.be.ok();
        expect(_doc.title2).to.be.ok('xxxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxxxx');
        done();
      });
    });
  });

  it ('should allow getting plugin settings', function (done) {
    schema = new Schema({
      title1: String,
      title2: String,
      title3: String
    }, { capped: { size: 1000, max: 5, autoIndexId: true } });
    
    // Applying plugin
    schema.plugin(mongooseAllocate, { fieldName: 'padding', len: 100, char: 'x'});

    Model = mongoose.model('M3', schema);

    Model.create({
      title1: 'T'
    }, function (err, doc) {
      if (err) return done(err);
      expect(Model.getPaddingSettings()).to.be.eql({ len: 100, char: 'x', fieldName: 'padding'});
      done();
    });
  });

  it ('should use default settings if no options are passed', function (done) {
    schema = new Schema({
      title1: String,
      title2: String,
      title3: String
    }, { capped: { size: 1000, max: 5, autoIndexId: true } });
    
    // Applying plugin
    schema.plugin(mongooseAllocate);

    Model = mongoose.model('M', schema);

    Model.create({
      title1: 'T'
    }, function (err, doc) {
      if (err) return done(err);
      expect(Model.getPaddingSettings()).to.be.eql({ len: 256, char: '0', fieldName: '__p'});
      done();
    });
  });

  it ('should get settings with both static and instance "getPaddingSettings" method', function (done) {
    schema = new Schema({
      title1: String
    }, { capped: { size: 1000, max: 5, autoIndexId: true } });
    
    // Applying plugin
    schema.plugin(mongooseAllocate);
    Model = mongoose.model('M4', schema);

    Model.create({
      title1: 'T'
    }, function (err, doc) {
      if (err) return done(err);
      expect(Model.getPaddingSettings()).to.be.eql(doc.getPaddingSettings());
      done();
    });
  });
});
