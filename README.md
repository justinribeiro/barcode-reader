[![npm version](https://badge.fury.io/js/%40justinribeiro%2Fbarcode-reader.svg)](https://badge.fury.io/js/%40justinribeiro%2Fbarcode-reader)

# \<barcode-reader\>

> A web component that reads barcodes via the Shape Detection API via a Web Worker.

![screenshot of barcode-reader](https://user-images.githubusercontent.com/643503/57164618-8765b100-6da9-11e9-9a22-6e6f7fda9c97.png)

## Features

* Uses Shape Detection API available in Chrome M74 (see https://www.chromestatus.com/feature/4757990523535360).
* Module scripts on DedicatedWorker. You can try the feature with '--enable-experimental-web-platform-features' flag (see https://crbug.com/680046)
* Uses [Comlink](https://github.com/GoogleChromeLabs/comlink) for the proxy of the worker
* Built as a web component via [LitElement](https://lit-element.polymer-project.org/)

## Experimental

Please note, this is **not** production ready. It's not polyfilled, it relies on an experimental platform feature for the Web Worker, and generally I've just been toying with it in various Chrome builds for quite some time.

Use at your own peril! 🐉🔥

## A more complete example

If you're looking for a more complete PWA example of using barcodes on the web, I highly recommend [Paul Kinlans' QR Snapper](https://github.com/PaulKinlan/qrcode) as well as his blog.

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
