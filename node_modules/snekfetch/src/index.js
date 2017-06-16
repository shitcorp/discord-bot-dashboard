require('stream');
const zlib = require('zlib');
const qs = require('querystring');
const http = require('http');
const https = require('https');
const URL = require('url');
const Package = require('../package.json');
const Stream = require('stream');
const FormData = require('./FormData');

/**
 * Snekfetch
 * @extends Stream.Readable
 * @extends Promise
 */
class Snekfetch extends Stream.Readable {
  /**
   * Create a request, but you probably wanna use `snekfetch#method`
   * @param {string} method HTTP method
   * @param {string} url URL
   * @param {Object} opts Options
   * @param {Object} [opts.headers] Headers to initialize the request with
   * @param {Object|string|Buffer} [opts.data] Data to initialize the request with
   * @param {string|Object} [opts.query] Query to intialize the request with
   */
  constructor(method, url, opts = { headers: null, data: null, query: null }) {
    super();

    const options = URL.parse(url);
    options.method = method.toUpperCase();
    if (opts.headers) options.headers = opts.headers;

    this.request = (options.protocol === 'https:' ? https : http).request(options);
    if (opts.query) this.query(opts.query);
    if (opts.data) this.send(opts.data);
  }

  /**
   * Add a query param to the request
   * @param {string|Object} name Name of query param or object to add to query
   * @param {string} [value] If name is a string value, this will be the value of the query param
   * @returns {Snekfetch} This request
   */
  query(name, value) {
    if (this.response) throw new Error('Cannot modify query after being sent!');
    if (!this.request.query) this.request.query = {};
    if (name !== null && typeof name === 'object') {
      this.request.query = Object.assign(this.request.query, name);
    } else {
      this.request.query[name] = value;
    }
    return this;
  }

  /**
   * Add a header to the request
   * @param {string|Object} name Name of query param or object to add to headers
   * @param {string} [value] If name is a string value, this will be the value of the header
   * @returns {Snekfetch} This request
   */
  set(name, value) {
    if (this.response) throw new Error('Cannot modify headers after being sent!');
    if (name !== null && typeof name === 'object') {
      for (const key of Object.keys(name)) this.set(key, name[key]);
    } else {
      this.request.setHeader(name, value);
    }
    return this;
  }

  /**
   * Attach a form data object
   * @param {string} name Name of the form attachment
   * @param {string|Object|Buffer} data Data for the attachment
   * @param {string} [filename] Optional filename if form attachment name needs to be overridden
   * @returns {Snekfetch} This request
   */
  attach(name, data, filename) {
    if (this.response) throw new Error('Cannot modify data after being sent!');
    const form = this._getFormData();
    this.set('Content-Type', `multipart/form-data; boundary=${form.boundary}`);
    form.append(name, data, filename);
    this.data = form;
    return this;
  }

  /**
   * Send data with the request
   * @param {string|Buffer|Object} data Data to send
   * @returns {Snekfetch} This request
   */
  send(data) {
    if (this.response) throw new Error('Cannot modify data after being sent!');
    if (data !== null && typeof data === 'object') {
      const header = this._getRequestHeader('content-type');
      let serialize;
      if (header) {
        if (header.includes('json')) serialize = JSON.stringify;
        else if (header.includes('urlencoded')) serialize = qs.stringify;
      } else {
        this.set('Content-Type', 'application/json');
        serialize = JSON.stringify;
      }
      this.data = serialize(data);
    } else {
      this.data = data;
    }
    return this;
  }

  then(resolver, rejector) {
    return new Promise((resolve, reject) => {
      const request = this.request;

      const handleError = (err) => {
        if (!err) err = new Error('Unknown error occured');
        err.request = request;
        reject(err);
      };

      request.on('abort', handleError);
      request.on('aborted', handleError);
      request.on('error', handleError);

      request.on('response', (response) => {
        const stream = new Stream.PassThrough();
        if (this._shouldUnzip(response)) {
          response.pipe(zlib.createUnzip({
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH,
          })).pipe(stream);
        } else {
          response.pipe(stream);
        }

        let body = [];

        stream.on('data', (chunk) => {
          if (!this.push(chunk)) this.pause();
          body.push(chunk);
        });

        stream.on('end', () => {
          this.push(null);
          const concated = Buffer.concat(body);

          if (this._shouldRedirect(response)) {
            let method = this.request.method;
            if ([301, 302].includes(response.statusCode)) {
              if (method !== 'HEAD') method = 'GET';
              this.data = null;
            } else if (response.statusCode === 303) {
              method = 'GET';
            }

            const headers = {};
            if (this.request._headerNames) {
              for (const name of Object.keys(this.request._headerNames)) {
                if (name.toLowerCase() === 'host') continue;
                headers[this.request._headerNames[name]] = this.request._headers[name];
              }
            } else {
              for (const name of Object.keys(this.request._headers)) {
                if (name.toLowerCase() === 'host') continue;
                const header = this.request._headers[name];
                headers[header.name] = header.value;
              }
            }

            const newURL = /^https?:\/\//i.test(response.headers.location) ?
              response.headers.location :
              URL.resolve(makeURLFromRequest(request), response.headers.location);
            resolve(new Snekfetch(method, newURL, { data: this.data, headers }));
            return;
          }

          /**
           * @typedef {Object} SnekfetchResponse
           * @prop {HTTP.Request} request
           * @prop {?string|object|Buffer} body Processed response body
           * @prop {string} text Raw response body
           * @prop {boolean} ok If the response code is >= 200 and < 300
           * @prop {number} status HTTP status code
           * @prop {string} statusText Human readable HTTP status
           */
          const res = {
            request: this.request,
            get body() {
              delete res.body;
              const type = response.headers['content-type'];
              if (type && type.includes('application/json')) {
                try {
                  res.body = JSON.parse(res.text);
                } catch (err) {
                  res.body = res.text;
                } // eslint-disable-line no-empty
              } else if (type && type.includes('application/x-www-form-urlencoded')) {
                res.body = qs.parse(res.text);
              } else {
                res.body = concated;
              }

              return res.body;
            },
            text: concated.toString(),
            ok: response.statusCode >= 200 && response.statusCode < 300,
            headers: response.headers,
            status: response.statusCode,
            statusText: response.statusText || http.STATUS_CODES[response.statusCode],
          };

          if (res.ok) {
            resolve(res);
          } else {
            const err = new Error(`${res.status} ${res.statusText}`.trim());
            Object.assign(err, res);
            reject(err);
          }
        });
      });

      this._addFinalHeaders();
      if (this.request.query) this.request.path = `${this.request.path}?${qs.stringify(this.request.query)}`;
      request.end(this.data ? this.data.end ? this.data.end() : this.data : null);
    })
    .then(resolver, rejector);
  }

  catch(rejector) {
    return this.then(null, rejector);
  }

  /**
   * End the request
   * @param {Function} [cb] Optional callback to handle the response
   * @returns {Snekfetch} This request
   */
  end(cb) {
    return this.then(
      (res) => cb ? cb(null, res) : res,
      (err) => cb ? cb(err, err.status ? err : null) : err
    );
  }

  _read() {
    this.resume();
    if (this.response) return;
    this.catch((err) => this.emit('error', err));
  }

  _shouldUnzip(res) {
    if (res.statusCode === 204 || res.statusCode === 304) return false;
    if (res.headers['content-length'] === '0') return false;
    return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
  }

  _shouldRedirect(res) {
    return [301, 302, 303, 307, 308].includes(res.statusCode);
  }

  _getFormData() {
    if (!this._formData) this._formData = new FormData();
    return this._formData;
  }

  _addFinalHeaders() {
    if (!this.request) return;
    if (!this._getRequestHeader('user-agent')) {
      this.set('User-Agent', `snekfetch/${Snekfetch.version} (${Package.repository.url.replace(/\.?git/, '')})`);
    }
    if (this.request.method !== 'HEAD') this.set('Accept-Encoding', 'gzip, deflate');
  }

  get response() {
    return this.request ? this.request.res || this.request._response || null : null;
  }

  _getRequestHeader(header) {
    // https://github.com/jhiesey/stream-http/pull/77
    try {
      return this.request.getHeader(header);
    } catch (err) {
      return null;
    }
  }
}

Snekfetch.version = Package.version;

Snekfetch.METHODS = http.METHODS ?
  http.METHODS.concat('BREW') :
  ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
for (const method of Snekfetch.METHODS) {
  Snekfetch[method === 'M-SEARCH' ? 'msearch' : method.toLowerCase()] = (url) => new Snekfetch(method, url);
}

if (typeof module !== 'undefined') module.exports = Snekfetch;
else if (typeof window !== 'undefined') window.Snekfetch = Snekfetch;

function makeURLFromRequest(request) {
  return URL.format({
    protocol: request.connection.encrypted ? 'https:' : 'http:',
    hostname: request.getHeader('host'),
    pathname: request.path.split('?')[0],
    query: request.query,
  });
}
