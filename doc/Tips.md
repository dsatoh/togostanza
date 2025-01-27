# Tips

## How can I use external libraries?

Let's import `d3-scale` package and use the `scaleLinear` function, for example.

Do `npm install` (or use `yarn add` if you choose it)

```sh
$ npm install d3-scale
```

Then use `import` in `stanzas/hello/index.js`:

```js
import {scaleLinear} from "d3-scale";

export default async function hello(stanza, params) {
  const scale = scaleLinear().domain([0, 1.0]).range([0, 100]);
  console.log(scale(0.42));
}
```

## Self-hosting stanzas

You can serve your stanza repository with your own web server:

1. Run `npx togostanza build` to build stanzas for production.
2. Serve contents under `dist` directory.

Note that web servers that are going to serve stanzas need to add "Access-Control-Allow-Origin" header. This is because the stanzas are loaded by `<script type="module" ...>` and the request will be cross-origin requests.

GitHub pages are configured that way, so you won't have any problems. If you want to host stanzas yourself, you need to do it yourself.
