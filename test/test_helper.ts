import "mocha";

//@ts-ignore
import jsdom = require("jsdom-global");
jsdom();

import * as chai  from "chai";
import * as sinonChai from "sinon-chai";
chai.use(sinonChai);
import chaiSubset = require("chai-subset");
chai.use(chaiSubset);
