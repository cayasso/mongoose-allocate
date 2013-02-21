var expect = require('expect.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var padding = require('../lib/allocate');

/**
 * connect to MongoDB with Mongoose
 **/

var MongoDB = process.env.MONGO_DB || 'mongodb://localhost/mongoose-test-allocate';
mongoose.connect(MongoDB);

describe('mongoose-padding', function () {
	describe('capped collections', function () {
		it ('should fail without the plugin applied', function (done) {
			var s = new Schema({
				title1: String,
				title2: String,
				title3: String
			}, { capped: { size: 1000, max: 5, autoIndexId: true } });
			mongoose.model('M1', s).create({
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
			var s = new Schema({
				title1: String,
				title2: String,
				title3: String
			}, { capped: { size: 1000, max: 5, autoIndexId: true } });
			
			// Applying plugin
			s.plugin(padding);
		
			mongoose.model('M2', s).create({
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
			var s = new Schema({
				title1: String,
				title2: String,
				title3: String
			}, { capped: { size: 1000, max: 5, autoIndexId: true } });
			
			// Applying plugin
			s.plugin(padding, { fieldName: 'padding', len: 100, char: 'x'});
			var Model = mongoose.model('M3', s);

			Model.create({
				title1: 'T'
			}, function (err, doc) {
				if (err) return done(err);
				expect(Model.getPaddingSettings()).to.be.eql({ len: 100, char: 'x', fieldName: 'padding'});
				done();
			});
		});
		it ('should use default settings if no options are passed', function (done) {
			var s = new Schema({
				title1: String,
				title2: String,
				title3: String
			}, { capped: { size: 1000, max: 5, autoIndexId: true } });
			
			// Applying plugin
			s.plugin(padding);
			var Model = mongoose.model('M4', s);

			Model.create({
				title1: 'T'
			}, function (err, doc) {
				if (err) return done(err);
				expect(Model.getPaddingSettings()).to.be.eql({ len: 256, char: '0', fieldName: '__p'});
				done();
			});
		});
		it ('should get settings with both static and instance "getPaddingSettings" method', function (done) {
			var s = new Schema({
				title1: String
			}, { capped: { size: 1000, max: 5, autoIndexId: true } });
			
			// Applying plugin
			s.plugin(padding);
			var Model = mongoose.model('M5', s);
			Model.create({
				title1: 'T'
			}, function (err, doc) {
				if (err) return done(err);
				expect(Model.getPaddingSettings()).to.be.eql(doc.getPaddingSettings());
				done();
			});
		});
	});
});
