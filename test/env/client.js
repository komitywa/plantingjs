import jsdom from 'jsdom';
import Backbone from 'backbone';
import jQuery from 'jquery';

export default new Promise((resolve, reject) => {
  jsdom.env({
    html: '<html><body></body></html>',
    done(err, window) {
      global.window = window;
      global.document = window.document;

      Backbone.$ = jQuery(window);

      if (err) {
        reject(err);
      } else {
        resolve(window);
      }
    },
  });
});
