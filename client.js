'use strict';
let previous_state = '';

// reset the page favicon on load because Github doesn't do full pageloads.
const reset_favicon = () => {
  document.querySelector('head link[rel="icon"]').href = 'https://assets-cdn.github.com/favicon.ico';
  previous_state = '';
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
          'merged': '#6f42c1',
          'dirty': '#6a737d'
        };

        let canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        let ctx = canvas.getContext('2d');

        // Use the state color for the background
        ctx.fillStyle = states[state];
        ctx.fillRect(0,0,16,16);

        // Grab the first letter from the state and use it in the icon
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(state.charAt(0).toUpperCase(), 3, 13);

        document.querySelector('head link[rel="icon"]').href = canvas.toDataURL('image/x-icon');
      }
    } else {
      reset_favicon();
    }
  } else {
    reset_favicon();
  }
}

setInterval(update_favicon, 100);

