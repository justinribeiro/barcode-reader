[![npm version](https://badge.fury.io/js/%40justinribeiro%2Fbarcode-reader.svg)](https://badge.fury.io/js/%40justinribeiro%2Fbarcode-reader)

# \<barcode-reader\>

> A web component that reads barcodes via the Shape Detection API via a Web Worker.

![screenshot of stl-part-viewer](https://user-images.githubusercontent.com/643503/41803627-a4daf090-763f-11e8-9ef1-a2e11b0a34c6.png)

## Features

* Uses Shape Detection API available in Chrome M74 (see https://www.chromestatus.com/feature/4757990523535360).
* Module scripts on DedicatedWorker. You can try the feature with '--enable-experimental-web-platform-features' flag (see https://crbug.com/680046)
* Uses Comlink for the proxy of the worker
* Built as a web component LitElement

## Experimental
Please note, this is **not** production ready. It's not polyfilled, it relies on an experimental platform feature for the Web Worker, and generally I've just been toying with it in various Chrome builds for quite some time.

Use at your own peril! 🐉🔥

## Install

This web component is built with Polymer 3 and ES modules in mind and is
available on NPM:

Install barcode-reader:

```sh
npm i @justinribeiro/barcode-reader
# or
yarn add @justinribeiro/barcode-reader
```

After install, import into your project:

```js
import 'barcode-reader';
```

Finally, use as required:

```html
<barcode-reader></barcode-reader>
<script>
  customElements.whenDefined('barcode-reader').then(() => {
    const barcodeReader = document.querySelector('barcode-reader');

    // start the camera stream
    // always looks for
    // facingMode: {
    //   exact: 'environment',
    // }
    barcodeReader.start();

    // component returns a custom event with results
    document.addEventListener('barcodes-found', (event) => {
      console.log(event.detail.barcodes);

      // if you want to stop streaming, ala, I'm hiding you now
      barcodeReader.stop();
    }, false);
  });
</script>
```