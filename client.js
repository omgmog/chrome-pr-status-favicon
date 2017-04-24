'use strict';
let previous_state = '';

// reset the page favicon on load because Github doesn't do full pageloads.
const reset_favicon = () => {
  document.querySelector('head link[rel="icon"]').href = 'https://assets-cdn.github.com/favicon.ico';
  previous_state = '';
}
// Rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

const update_favicon = () => {
  let state_element = document.querySelectorAll('.branch-action')[0];

  // Don't run on pages without the branch action element
  if (state_element) {

    // Also don't run on pages where the branch action element is hidden
    if (getComputedStyle(state_element).display !== 'none') {

      let state_element_classes = state_element.className.split(' ');
      let state = state_element_classes.find((c) => {
        let current_state = '';
        if (/branch\-action\-state\-.*/.test(c)) {
          current_state = c;
        }
        return current_state;
      });
      state = state.replace('branch-action-state-', '');

      // no need to update if nothing has changed

      if (previous_state !== state) {
        previous_state = state;

        const states = {
          'clean': '#31BE4E',
          'error': '#d73a49',
          'unknown': '#dbab09',
          'unstable': '#dbab09',
          'merged': '#6f42c1',
          'dirty': '#6a737d'
        };

        let canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        let ctx = canvas.getContext('2d');

        // Use the state color for the background
        ctx.fillStyle = states[state];
        ctx.roundRect(0,0,ctx.canvas.width,ctx.canvas.height,2);
        ctx.fill();

        // gradient
        let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,.15)');
        ctx.fillStyle = grad;
        ctx.roundRect(0,0,ctx.canvas.width,ctx.canvas.height,2);
        ctx.fill();


        // Draw the appropriate icon
        ctx.fillStyle = '#fff';
        let path = new Path2D('M11 11.3V5c0-.8-.3-1.5-1-2-.5-.6-1.2-1-2-1H7V0L4 3l3 3V4h1c.3 0 .5 0 .7.3.2.2.3.4.3.7v6.3c-.6.3-1 1-1 1.7 0 1 1 2 2 2s2-1 2-2c0-.7-.4-1.4-1-1.7zm-1 3c-.7 0-1.2-.7-1.2-1.3 0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2-.5 1.2-1.2 1.2zM4 3c0-1-1-2-2-2S0 2 0 3c0 .7.4 1.4 1 1.7v6.6c-.6.3-1 1-1 1.7 0 1 1 2 2 2s2-1 2-2c0-.7-.4-1.4-1-1.7V4.7c.6-.3 1-1 1-1.7zm-.8 10c0 .7-.6 1.2-1.2 1.2S.8 13.7.8 13s.6-1.2 1.2-1.2 1.2.5 1.2 1.2zM2 4.2C1.3 4.2.8 3.6.8 3S1.4 1.8 2 1.8s1.2.6 1.2 1.2S2.6 4.2 2 4.2z');
        ctx.translate(2, 0);
        ctx.fill(path, 'evenodd');
        ctx.translate(-2, 0);

        document.querySelector('head link[rel="icon"]').href = canvas.toDataURL('image/png');
      }
    } else {
      reset_favicon();
    }
  } else {
    reset_favicon();
  }
}

setInterval(update_favicon, 100);

