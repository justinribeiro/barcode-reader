import * as Comlink from 'comlink';

let detect = async (imageData) => {
  try {
    const barcodeDetector = new BarcodeDetector();
    let barcodes = await barcodeDetector.detect(imageData);
    if (barcodes.length > 0) {
      return barcodes;
    }
  } catch(err) {
    console.error('BarcodeDetector error! Possibly you need the polyfill.');
  }
};

Comlink.expose({detect}, self);