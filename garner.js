var bakajax = require('bakajax');

function Garner(databaseId, albumId, username, password) {
    this.sessionKey = false;
    this.databaseId = databaseId;
    this.albumId = albumId;
    this.username = username;
    this.url = 'https://www.bobco.moe:3063/api/1';
    this.password = password;
}
Garner.prototype.getSession = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        bakajax.post(self.url+'/login/'+self.databaseId+'/'+self.username, {'key': self.password})
        .then(function(response) {
            if (response.code == 200) {
                resolve(response.sessionKey);
            } else {
                reject(false);
            }
        })
        .catch(function(err) {
            reject(err);
        });
    });
}
Garner.prototype.searchFor = function(searchURL, compareValue, max, excludes = false) {
    var self = this;
    if (searchURL) {
        if (!max || max < 0) {
            max = 10;
        }
        return new Promise(function(resolve, reject) {
            bakajax.post(self.url+'/get/'+self.databaseId+'/'+self.albumId+'/'+self.username, {
                'sessionKey': self.sessionKey,
                'searchURL': searchURL,
                'compareValue': compareValue,
                'max': max,
                'excludes': excludes
            })
            .then(function(response) {
                switch (response.code) {
                    case 200:
                        resolve(response.data);
                        break;
                    case 630:
                        self.getSession()
                        .then(function(sessionKey) {
                            self.sessionKey = sessionKey;
                            bakajax.post(self.url+'/get/'+self.databaseId+'/'+self.albumId+'/'+self.username, {
                                'sessionKey': self.sessionKey,
                                'searchURL': searchURL,
                                'compareValue': compareValue,
                                'max': max,
                                'excludes': excludes
                            })
                            .then(function(response) {
                                switch (response.code) {
                                    case 200:
                                        resolve(response.data);
                                        break;
                                    case 630:
                                        reject('Failed to log in to Garner');
                                        break;
                                    default:
                                        reject('Other garner failure');
                                        break;
                                }
                            })
                            .catch(function(err) {
                                reject(err);
                            });
                        })
                        .catch(function(err) {
                            self.sessionKey = false;
                        });
                        break;
                    default:
                        reject('Other garner failure');
                        break;
                }
            })
            .catch(function(err) {
                console.log(err);
                reject(err);
            });
        });
    }
}
Garner.prototype.updateItem = function(searchURL, compareValue, replacementURL, replacementItem) {
    var self = this;
    if (searchURL && (compareValue || compareValue == '') && replacementURL && (replacementItem || replacementItem == '')) {
        return new Promise(function(resolve, reject) {
            bakajax.put(self.url+'/'+self.databaseId+'/'+self.albumId+'/'+self.username, {
                'sessionKey': self.sessionKey,
                'searchURL': searchURL,
                'compareValue': compareValue,
                'replacementURL': replacementURL,
                'replacementItem': replacementItem
            })
            .then(function(response) {
                switch (response.code) {
                    case 200:
                        resolve(response.data);
                        break;
                    case 630:
                        self.getSession()
                        .then(function(sessionKey) {
                            self.sessionKey = sessionKey;
                            bakajax.put(self.url+'/'+self.databaseId+'/'+self.albumId+'/'+self.username, {
                                'sessionKey': self.sessionKey,
                                'searchURL': searchURL,
                                'compareValue': compareValue,
                                'replacementURL': replacementURL,
                                'replacementItem': replacementItem
                            })
                            .then(function(response) {
                                switch (response.code) {
                                    case 200;
                                        resolve(response.data);
                                        break;
                                    case 630:
                                        reject('Failed to log in to Garner');
                                        break;
                                    default:
                                        reject('Other garner failure');
                                        break;
                                }
                            })
                            .catch(function(err) {
                                reject(err);
                            });
                        })
                        .catch(function() {
                            self.sessionKey = false;
                        });
                        break;
                    default:
                        reject(response.code);
                        break;
                }
            })
            .catch(function(err) {
                reject(err);
            });
        });
    }
}
module.exports = Garner;
