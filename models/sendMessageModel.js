'use strict';
class sendMessageModel {

    constructor() {
        this.errors = null;
        this.isOk = false;
        this.message = '';
        this.token = '';
        this.result = null;
    }
    isOk = false;
    message = '';
    result = null;
    token = '';
    license={};
    errors = null;
}

module.exports = {
    sendMessageModel
  }