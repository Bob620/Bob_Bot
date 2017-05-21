module.exports = class WebServer {
  constructor({port: port = 3063, active: active = false}, webserver) {
    this.port = port;
    this.active = active;
    this.webserver = webserver;
  }

  addGet(url = false, callback = false) {
    if (url && callback) {
      this.webserver.get(url, callback);
    } else {
      throw "webserver GETs require url and callback";
    }
  }

  addPost(url = false, callback = false) {
    if (url && callback) {
      this.webserver.post(url, callback);
    } else {
      throw "webserver POSTs require url and callback";
    }
  }

  open() {
    // Attach any backup 404
//    this.webserver.use(function(req, res, next) {
//      var err = new Error('Not Found');
//      err.status = 404;
//      next(err);
//    });

    if (this.active) {
      this.webserver.listen(this.port);
      console.log(`Webserver Listening on port ${this.port}`);
    } else {
      console.log("Webserver Disabled");
    }
  }
}
