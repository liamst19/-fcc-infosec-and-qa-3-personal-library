/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
       chai.request(server)
        .post('/api/books')
        .send({
           title: 'Test Book Title'
         })
        .end((err, res) => {
           assert.equal(res.status, 200);
           assert.equal(res.body.title, 'Test Book Title')
           done();
         })
      });
      
      test('Test POST /api/books with no title given', function(done) {
       chai.request(server)
        .post('/api/books')
        .send({
         })
        .end((err, res) => {
           assert.equal(res.status, 400);
           done();
         })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
       chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });      
      });  
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
       chai.request(server)
        .get('/api/books/5ea63029b5b90203e04b458a')
        .end(function(err, res){
          assert.equal(res.status, 400);
          done();
        });      
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
       chai.request(server)
        .get('/api/books/5ea63b50ae482a2fcc9f50f9')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Test GET /api/books/[id] with valid id in db')
          done();
        });      
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
       chai.request(server)
        .post('/api/books/5ea63b50ae482a2fcc9f50f9')
        .send({
           comment: 'test comment'
         })
        .end((err, res) => {
           console.log('POST comment: response', {status: res.status})
           assert.equal(res.status, 200);
           assert.equal(res.body._id, '5ea63b50ae482a2fcc9f50f9')
           assert.equal(res.body.title, 'Test GET /api/books/[id] with valid id in db')
           done();
         })
      });
      
    });

  });

});
