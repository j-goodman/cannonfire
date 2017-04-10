window.zMax = 0;

var initializeWindows = function () {
  var adjuster;
  var bar;
  var close;
  var description;
  var i;
  var left;
  var top;
  var windows;
  windows = document.getElementsByTagName('wd-window');
  left = 300;
  top = 20;
  for (i=0 ; i<windows.length ; i++) {
    // windows[i].style.left = left;
    // windows[i].style.top = top;
    if (windows[i].className.includes('closed')) {
      windows[i].style.display = 'none';
    }
    // left += 120;
    // if (left > window.innerWidth - 300) {
    //   left = 240;
    //   top += 120;
    // }
    if (windows[i].className.includes('fullpage')) {
      windows[i].style.height = '80%';
      windows[i].style.width = '80%';
      windows[i].style.left = '10%';
      windows[i].style.top = '10%';
    }
    bar = document.createElement('BAR');
    close = document.createElement('CLOSE');
    description = document.createElement('DESCRIPTION');
    adjuster = document.createElement('ADJUSTER');
    close.innerText = '✕';
    adjuster.innerText = '↘';
    description.innerText = windows[i].id;
    windows[i].insertBefore(bar, windows[i].childNodes[0]);
    windows[i].appendChild(adjuster);
    if (!windows[i].className.includes('unclosable')) {
      bar.appendChild(close);
    }
    bar.appendChild(description);
    setupWindowControls(windows[i], close, bar, adjuster, description);
  }
  setInitialWindowPositions(windows);
};

var setupWindowControls = function (main, close, bar, adjuster, description) {
  // CLOSE WINDOW
  close.onclick = function () {
    this.style.display = 'none';
  }.bind(main);

  // MOVE WINDOW
  bar.onmousedown = function (event) {
    bar.originX = event.clientX - main.getBoundingClientRect().left;
    bringToFront(main);
    window.onmousemove = function (event) {
      main.style.left = event.clientX - bar.originX;
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

  // CHANGE WINDOW TITLE
  main.changeTitle = function (newTitle) {
    description.innerText = newTitle;
  }
};

var bringToFront = function (el) {
  if (el.style.zIndex <= window.zMax) {
    el.style.zIndex = window.zMax + 1;
    window.zMax = parseInt(el.style.zIndex);
  }
};

var openWindow = function (windowName) {
  var i;
  var windu;
  windu = document.getElementById(windowName);
  windu.style.display = 'block';
  setTimeout(function () {
    bringToFront(windu);
  }, 20)
}
