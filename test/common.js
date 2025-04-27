module.exports.handleResponse = (err, res) => {
    if (res.statusCode === 200) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
        res.body.should.have.property('error');
        res.body.error.should.equal(false);
    } else {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('error');
        res.body.error.should.equal(true);
        res.body.should.have.property('message');
    }
};

module.exports.chaiCallback = (err, res, done) => {
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('error').eql(false);
    res.body.should.have.property('data');
    if (done) {
        done();
    } else {
        return res.body.data.id;
    }
};
