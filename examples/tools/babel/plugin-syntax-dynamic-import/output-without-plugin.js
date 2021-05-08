define([
  'require',
  '@babel/runtime/helpers/typeof',
  'core-js/modules/es.object.to-string.js',
  'core-js/modules/es.promise.js',
  'core-js/modules/es.array.iterator.js',
  'core-js/modules/es.string.iterator.js',
  'core-js/modules/es.weak-map.js',
  'core-js/modules/esnext.weak-map.delete-all.js',
  'core-js/modules/web.dom-collections.iterator.js',
  'core-js/modules/es.object.get-own-property-descriptor.js',
], function(
  _require,
  _typeof2,
  _esObjectToString,
  _esPromise,
  _esArrayIterator,
  _esStringIterator,
  _esWeakMap,
  _esnextWeakMapDeleteAll,
  _webDomCollectionsIterator,
  _esObjectGetOwnPropertyDescriptor,
) {
  'use strict';

  var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

  _typeof2 = _interopRequireDefault(_typeof2);

  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== 'function') return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache(
      nodeInterop,
    ) {
      return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }

  function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }
    if (
      obj === null ||
      ((0, _typeof2.default)(obj) !== 'object' && typeof obj !== 'function')
    ) {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor =
      Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor
          ? Object.getOwnPropertyDescriptor(obj, key)
          : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }

  var btn = document.getElementById('btn');
  btn.addEventListener('click', function() {
    new Promise(function(_resolve, _reject) {
      return _require(
        ['./dynamic'],
        function(imported) {
          return _resolve(_interopRequireWildcard(imported));
        },
        _reject,
      );
    }).then(function(e) {
      console.log(e);
      e.default();
    });
  });
});
