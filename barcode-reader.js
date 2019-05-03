import {LitElement, html, css} from 'lit-element';
import * as Comlink from 'comlink';

/**
 * `barcode-reader`
 *
 *
 * @polymer
 * @extends HTMLElement
 * @demo demo/index.html
 */
class BarcodeReader extends LitElement {
  static get properties() {
    return {

    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }

      canvas {
        display:none;
      }

      video {
        width: 100%;
        height: 100%;
      }

      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: transparent;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.5);
        pointer-events: none;
        z-index: 20;
        border-width: 2em;
      }

      #scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        visibility: visible;
        background: linear-gradient(to bottom, transparent 51%, red 51%, transparent 52%)
      }
    `;
  }

  render() {
    return html`
      <div id="overlay">
        <div id="scanline"></div>
      </div>
      <canvas width="640" height="480"></canvas>
      <video width="640" height="480" muted autoplay playsinline />
    `;
  }

  constructor() {
    super();

    this.__context = null;
    this.__video = null;

    // Module scripts are not supported on DedicatedWorker yet. You can try the
    // feature with '--enable-experimental-web-platform-features' flag (see
    // https://crbug.com/680046)
    //
    // This path is also specific to the demo/index.html; have to fix
    this.__barcodeProxy = Comlink.proxy(new Worker('../barcode-worker.js', { type: "module" }));
  }

  firstUpdated() {
    this.__context = this.shadowRoot.querySelector('canvas').getContext('2d');
    this.__video = this.shadowRoot.querySelector('video');
    this.__videoInputSelector = this.shadowRoot.querySelector('#videoInput');
  }

  _onFrame() {
    if(this.__video.videoWidth > 0) {
      this._drawFrame(this.__video);
    }
    this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
  };

  _drawFrame(frameData) {
    this.__context.drawImage(frameData, 0, 0, 640, 480, 0, 0, 640, 480);
    this._processFrame();
  }

  async _processFrame() {
    if(!this.__jobProcessingFrame) {
      this.__jobProcessingFrame = true;

      const imageData = this.__context.getImageData(0, 0, 640, 480);
      const data = await this.__barcodeProxy.detect(imageData);
      if (data) {
        this.dispatchEvent(new CustomEvent('barcodes-found', {
          bubbles: true,
          composed: true,
          detail: {
            barcodes: data
          }
        }));
      }
      this.__jobProcessingFrame = false;
    }
  }

  async start() {
    // bigger video = more memory = more OOM on constrained devices
    const constraints = {
      'audio': false,
      'video': {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 720 },
        facingMode: {
          exact: 'environment',
        }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    this.__video.addEventListener('loadeddata', (e) => {
      this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
    });

    this.__video.srcObject = stream;
    this.__stream = stream;
  }

  stop() {
    this.__stream.getTracks()[0].stop();
  }
}

window.customElements.define('barcode-reader', BarcodeReader);
