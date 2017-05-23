var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);

var endpoint = "https://criticalmaps-api.stephanlindauer.de:80";

var test_user_A = {
  "device": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "location": {
    "longitude": 12345,
    "latitude": 54321
  }
};

var test_user_B_location_1 = {
  "device": "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  "location": {
    "longitude": 1,
    "latitude": 1
  }
};

var test_user_B_location_2 = {
  "device": "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  "location": {
    "longitude": 2,
    "latitude": 2
  }
};

describe('test location logic', function() {
  it('should not return own location', function(done) {
    chai.request(endpoint)
      .post('/')
      .send(test_user_A)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        console.log(res.body)
        expect(res.body.locations).to.not.include.keys(test_user_A.device);
        done();
      });
  });

  it('should receive previous location from test user A', function(done) {
    chai.request(endpoint)
      .post('/')
      .send(test_user_B_location_1)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        console.log(res.body)
        expect(res.body.locations[test_user_A.device])
          .to.deep.equal(test_user_A.location)
        done();
      });
  });

  it('should save new location test user B', function(done) {
    chai.request(endpoint)
      .post('/')
      .send(test_user_B_location_2)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it('should receive new location from test user B', function(done) {
    chai.request(endpoint)
      .post('/')
      .send(test_user_A)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.locations[test_user_B_location_1.device])
          .to.deep.equal(test_user_B_location_2.location)
        done();
      });
  });


// describe('test messaging logic', function() {
//   it('should not return own location', function(done) {
//     chai.request('http://' + host + ':' + port)
//       .post('/')
//       .send(test_user_A)
//       .end(function(err, res) {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         console.log(res.body)
//         expect(res.body.locations).to.not.include.keys(test_user_A.device);
//         done();
//       });
//   });

});
