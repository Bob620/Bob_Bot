const bakajax = require('bakajax');

function Garner(databaseId = false, albumId = false, username = false, password = false) {
    this.sessionKey = false;
    this.databaseId = databaseId;
    this.albumId = albumId;
    this.username = username;
    this.url = 'https://www.bobco.moe:3063/api/1';
    this.password = password;
}
Garner.prototype.getSession = function() {
    return new Promise((resolve, reject) => {
        bakajax.post(this.url+'/login/'+this.databaseId+'/'+this.username, {'key': this.password})
        .then((response) => {
            if (response.code == 200) {
                resolve(response.sessionKey);
            } else {
                reject(false);
            }
        })
        .catch((err) => {
            reject(err);
        });
    });
}
Garner.prototype.searchFor = function(searchURL = false, compareValue = false, max = 10, excludes = false) {
    if (searchURL) {
        if (!max || max < 0) {
            max = 10;
        }
        return new Promise((resolve, reject) => {
            bakajax.post(this.url+'/get/'+this.databaseId+'/'+this.albumId+'/'+this.username, {
                'sessionKey': this.sessionKey,
                'searchURL': searchURL,
                'compareValue': compareValue,
                'max': max,
                'excludes': excludes
            })
            .then((response) => {
                switch (response.code) {
                    case 200:
                        resolve(response.data);
                        break;
                    case 630:
                        this.getSession()
                        .then((sessionKey) => {
                            this.sessionKey = sessionKey;
                            bakajax.post(this.url+'/get/'+this.databaseId+'/'+this.albumId+'/'+this.username, {
                                'sessionKey': this.sessionKey,
                                'searchURL': searchURL,
                                'compareValue': compareValue,
                                'max': max,
                                'excludes': excludes
                            })
                            .then((response) => {
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
                            .catch((err) =. {
                                reject(err);
                            });
                        })
                        .catch((err) => {
                            self.sessionKey = false;
                        });
                        break;
                    default:
                        reject('Other garner failure');
                        break;
                }
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
}
Garner.prototype.updateItem = function(searchURL = false, compareValue = false, replacementURL = false, replacementItem = false) {
    if (searchURL && (compareValue || compareValue == '') && replacementURL && (replacementItem || replacementItem == '')) {
        return new Promise((resolve, reject) => {
            bakajax.put(this.url+'/'+this.databaseId+'/'+this.albumId+'/'+this.username, {
                'sessionKey': this.sessionKey,
                'searchURL': searchURL,
                'compareValue': compareValue,
                'replacementURL': replacementURL,
                'replacementItem': replacementItem
            })
            .then((response) => {
                switch (response.code) {
                    case 200:
                        resolve(response.data);
                        break;
                    case 630:
                        this.getSession()
                        .then((sessionKey) => {
                            this.sessionKey = sessionKey;
                            bakajax.put(this.url+'/'+this.databaseId+'/'+this.albumId+'/'+this.username, {
                                'sessionKey': this.sessionKey,
                                'searchURL': searchURL,
                                'compareValue': compareValue,
                                'replacementURL': replacementURL,
                                'replacementItem': replacementItem
                            })
                            .then((response) => {
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
                            .catch((err) => {
                                reject(err);
                            });
                        })
                        .catch(() => {
                            this.sessionKey = false;
                        });
                        break;
                    default:
                        reject(response.code);
                        break;
                }
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
}
module.exports = Garner;
