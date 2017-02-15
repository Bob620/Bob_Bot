const log = require('./src/util/log.js');

log.addDomain("test");
log.addDomain("discord");
log.addDomain("toka");

log.error("err", "This is a test");
log.error("err");
log.log("Test", "Test log!");
log.log("discord", "Test log!");
log.log("toka", "Test log!");
log.log("toka", "Test log!");
log.log("discord", "Test log!");
log.log("toka", "Test log!");
log.log("discord", "Test log!");
log.log("discord", "Test log!");
log.log("discord", "Test log!");
log.log("toka", "Test log!");
log.log("discord", "Test log!");
log.log("toka", "Test log!");
log.log("discord", "Test log!");
