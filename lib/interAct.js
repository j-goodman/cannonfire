window.zMax = 0;

var initializeWindows = function () {
  var adjuster;
  var bar;
  var close;
  var description;
  var i;
  var left;
  var windows;
  windows = document.getElementsByTagName('ia-window');
  left = 0;
  for (i=0 ; i<windows.length ; i++) {
    windows[i].style.left = left;
    left += 300;
    bar = document.createElement('BAR');
    close = document.createElement('CLOSE');
    description = document.createElement('DESCRIPTION');
    adjuster = document.createElement('ADJUSTER');
    close.innerText = '✕';
    adjuster.innerText = '↘';
    description.innerText = windows[i].title;
    windows[i].insertBefore(bar, windows[i].childNodes[0]);
    windows[i].appendChild(adjuster);
    bar.appendChild(close);
    bar.appendChild(description);
    setupWindowControls(windows[i], close, bar, adjuster);
  }
};

var setupWindowControls = function (main, close, handle, adjuster) {
  // CLOSE WINDOW
  close.onclick = function () {
    this.parentNode.removeChild(this);
  }.bind(main);

  // MOVE WINDOW
  handle.onmousedown = function (event) {
    handle.originX = event.clientX - main.getBoundingClientRect().left;
    bringToFront(main);
    window.onmousemove = function (event) {
      main.style.left = event.clientX - handle.originX;
      main.style.top = event.clientY - 16;
    };
    window.onmouseup = function () {
      window.onmousemove = function () {};
    };
  };

  // RESIZE WINDOW
  adjuster.onmousedown = function () {
    adjuster.originX = main.getBoundingClientRect().left;
    adjuster.originY = main.getBoundingClientRect().top;
    bringToFront(main);
    window.onmousemove = function (event) {
      main.style.width = event.clientX - adjuster.originX + 12;
      main.style.height = event.clientY - adjuster.originY + 12;
      if (event.clientX - adjuster.originX < 120) {
        main.style.width = 120;
      }
      if (event.clientY - adjuster.originY < 120) {
        main.style.height = 120;
      }
    };
    window.onmouseup = function () {
      window.onmousemove = function () {};
    };
  };

  // BRING WINDOW TO FRONT ON CLICK
  main.onclick = function () {
    bringToFront(main);
  }.bind(main);
};

var initializeSelectors = function () {
  var selectors;
  selectors = document.getElementsByTagName('ia-selector');
}

var bringToFront = function (el) {
  if (el.style.zIndex <= window.zMax) {
    el.style.zIndex = window.zMax + 1;
    window.zMax = parseInt(el.style.zIndex);
  }
};
