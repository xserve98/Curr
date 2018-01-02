'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = request;

var _fetch = require('dva/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function request(url, options) {
  options.headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
  options.credentials = 'include';
  return (0, _fetch2.default)(url, options)
  //.then(checkStatus)
  .then(parseJSON).then(function (data) {
    if (data.code >= 200 && data.code < 300) {
      return { success: true, result: data };
    }
    return { success: false, error: data.error, message: data.message };
  }).catch(function (err) {
    return { err: err };
  });
}
//# sourceMappingURL=request.js.map