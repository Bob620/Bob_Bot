class Domain {
  constructor(serverType=false, {requirements: requirements=[]}) {
    if (!server) {
      throw "Domain requires a server.";
    }
    this.serverType = serverType;
    this.requirements = requirements;
  }

  requires() {
    return {"serverType": this.serverType, "requirements": this.requirements};
  }

  start(info) {
    this.server = info.server;
    this.modules = info.requirements;

    if (!this.server.isReady) {
      this.server.once("ready", () => {
        this.ready();
      });
    } else {
      this.ready();
    }

    this.server.on("connect", () => {
      this.connect();
    });

    this.server.on("disconnect", () => {
      this.disconnect();
    });

    this.server.on("message", (message) => {
      this.message(message);
    });
  }

  addSubDomains() {
    
  }
}

module.exports = Domain;
