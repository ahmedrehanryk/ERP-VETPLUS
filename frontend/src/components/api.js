export const API = (path, opts={}) => fetch(`/api${path}`, {
  headers: {'Content-Type':'application/json', ...(opts.headers||{})},
  ...opts
}).then(r => r.json());
