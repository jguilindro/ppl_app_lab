global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.app = require('../../../app');
global.should = chai.should();
chai.use(chaiHttp);