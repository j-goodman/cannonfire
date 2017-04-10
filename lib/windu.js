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
  for (i=0 ; i<windows.length ; i++) {
    if (windows[i].className.includes('closed')) {
      windows[i].style.display = 'none';
    }
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
    if (!windows[i].className.includes('unclosable')) {
      close.innerText = '✕';
    };
    adjuster.innerText = '↘';
    description.innerText = windows[i].id;
    windows[i].insertBefore(bar, windows[i].childNodes[0]);
    windows[i].appendChild(adjuster);
    bar.appendChild(close);
    bar.appendChild(description);
    setupWindowControls(windows[i], close, bar, adjuster, description);
  }
  setInitialWindowPositions(windows);
};

var setupWindowControls = function (windu, close, bar, adjuster, description) {
  // CLOSE WINDOW
  if (!windu.className.includes('unclosable')) {
    close.onclick = function () {
      this.style.display = 'none';
    }.bind(windu);
  }

  // MOVE WINDOW
  bar.onmousedown = function (event) {
    bar.originX = event.clientX - windu.getBoundingClientRect().left;
    bringToFront(windu);
    window.onmousemove = function (event) {
      windu.style.left = event.clientX - bar.originX;
      windu.style.top = event.clientY - 16;
    };
    window.onmouseup = function () {
      window.onmousemove = function () {};
    };
  };

  // RESIZE WINDOW
  adjuster.onmousedown = function () {
    adjuster.originX = windu.getBoundingClientRect().left;
    adjuster.originY = windu.getBoundingClientRect().top;
    bringToFront(windu);
    window.onmousemove = function (event) {
      windu.style.width = event.clientX - adjuster.originX + 12;
      windu.style.height = event.clientY - adjuster.originY + 12;
      if (event.clientX - adjuster.originX < 120) {
        windu.style.width = 120;
      }
      if (event.clientY - adjuster.originY < 120) {
        windu.style.height = 120;
      }
    };
    window.onmouseup = function () {
      window.onmousemove = function () {};
    };
  };

  // BRING WINDOW TO FRONT ON CLICK
  windu.onclick = function () {
    bringToFront(windu);
  }.bind(windu);

  // CHANGE WINDOW TITLE
  windu.changeTitle = function (newTitle) {
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
