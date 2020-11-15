import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "./app";

const expect = chai.expect;

chai.use(chaiHttp);

const test_user_A = {
  device: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  location: {
    longitude: 12345,
    latitude: 54321,
  },
};

const test_user_B_location_1 = {
  device: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  location: {
    longitude: 1,
    latitude: 1,
  },
};

const test_user_B_location_2 = {
  device: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  location: {
    longitude: 2,
    latitude: 2,
  },
};

describe("test location logic", () => {
  it("should not return own location", (done) => {
    chai
      .request(app)
      .post("/")
      .send(test_user_A)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.locations).to.not.include.keys(test_user_A.device);
        done();
      });
  });

  it("should receive previous location from test user A", (done) => {
    chai
      .request(app)
      .post("/")
      .send(test_user_B_location_1)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.locations[test_user_A.device]).to.include(
          test_user_A.location
        );
        done();
      });
  });

  it("should save new location test user B", (done) => {
    chai
      .request(app)
      .post("/")
      .send(test_user_B_location_2)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it("should receive new location from test user B", (done) => {
    chai
      .request(app)
      .post("/")
      .send(test_user_A)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.locations[test_user_B_location_1.device]).to.include(
          test_user_B_location_2.location
        );
        done();
      });
  });
});
