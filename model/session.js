/**
 * Session.
 *
 * @param ctx {Context}
 * @param opts {Object} options.
 * @api private
 */
module.exports = Session;
function Session(ctx, opts) {
  this._ctx = ctx;

  opts = opts || {};

  this._name = opts.name;

  this._cookieOpts = opts.cookie;

  // load session cookie data
  var jsonString = this._ctx.cookies.get(this._name, this._cookieOpts);


  this._json = JSON.parse(jsonString || '{}');

  // new session?
  if (!this._json._sid) {
    this._isNew = true;
  } else {
    this._sid = this._json._sid;
    delete this._json._sid; // so that clients can't manipulate it
  }

  this._store = opts.store || 'cookie';
}


/**
 * Load the session data.
 *
 * This will load the data from the session store.
 *
 * @return {Object} the session data.
 *
 * @api private
 */
Session.prototype.load = function*() {
  if ('cookie' === this._store) {
    // use the cookie itself as the store
    //debug('use cookie as store');
    this._useCookieStore = true;
    this._prevSessionDataJSON = JSON.stringify(this._json);
    return this._json;
  } else {
    //debug('load store for %d', this._sid);
    this._prevSessionDataJSON = (yield this._store.load(this._sid)) || '{}';
    return JSON.parse(this._prevSessionDataJSON);
  }
};



/**
 * Save session changes.
 *
 * NOTE: this calls save on the session store and sets the cookie if it hasn't already been set.
 *
 * @param newData {Object} new session data to save.
 *
 * @api private
 */

Session.prototype.save = function*(newData) {
  // check session data is an object
  if ('object' !== typeof newData) {
    throw new Error('Session data must be a plain Object');
  }

  // if both previous and current session data are empty then do nothing
  var newJSON = JSON.stringify(newData),
    setCookieData = {};

  if (this._prevSessionDataJSON !== newJSON) {
    // if not cookie store then save the data
    if (!this._useCookieStore) {
      //debug('save data to store for %d: %j', this._sid, newJSON);
      yield this._store.save(this._sid, newJSON);
    }
    // if cookie store then cookie data = session data
    else {
      setCookieData = newData;
    }

    // add session id into cookie data
    setCookieData._sid = this._sid;

    // if (using cookie store) or (if this is a new session and is not empty)
    if (this._useCookieStore || this._isNew) {
      var cookieDataJSON = JSON.stringify(setCookieData);
      //debug('save cookie %s', cookieDataJSON);
      this._ctx.cookies.set(this._name, cookieDataJSON, this._cookieOpts);
    }
  }
};

/**
 * Remove the session.
 *
 * @api private
 */

Session.prototype.remove = function*(){
  //debug('remove');
  if (!this._useCookieStore) {
    yield this._store.remove(this._sid);
  }
  this._ctx.cookies.set(this._name, '', this._cookieOpts);
};