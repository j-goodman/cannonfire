window.zMax = 0;

var initializeWindows = function () {
  var adjuster;
  var bar;
  var close;
  var description;
  var expand;
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
    expand = document.createElement('EXPAND');
    description = document.createElement('DESCRIPTION');
    adjuster = document.createElement('ADJUSTER');
    close.innerText = '✕';
    expand.innerText = '▼';
    adjuster.innerText = '↘';
    description.innerText = windows[i].id;

    windows[i].insertBefore(bar, windows[i].childNodes[0]);
    windows[i].appendChild(adjuster);
    if (!windows[i].className.includes('unclosable')) {
      bar.appendChild(close);
    }
    bar.appendChild(expand);
    bar.appendChild(description);
    setupWindowControls(windows[i], close, bar, expand, adjuster, description);
  }
  setInitialWindowPositions(windows);
};

var setupWindowControls = function (windu, close, bar, expander, adjuster, description) {
  // CLOSE WINDOW
  if (!windu.className.includes('unclosable')) {
    close.onclick = function () {
      this.className = 'closed';
      this.style.display = 'none';
    }.bind(windu);
  }

  // MOVE WINDOW
  bar.onmousedown = function (event) {
    bringToFront(windu);
    bar.originX = event.clientX - windu.getBoundingClientRect().left;
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
    bringToFront(windu);
    adjuster.originX = windu.getBoundingClientRect().left;
    adjuster.originY = windu.getBoundingClientRect().top;
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

  // BRING WINDOW TO FRONT ON CLICK AND CHECK FOR OVERFLOW
  windu.onclick = function () {
    bringToFront(windu);
    checkOverflow(windu, expander);
  }.bind(windu);

  windu.onmouseover = function () {
    checkOverflow(windu, expander);
  };

  // CHANGE WINDOW TITLE
  windu.changeTitle = function (newTitle) {
    description.innerText = newTitle;
  };

  // AUTOEXPAND WINDOW
  expander.onclick = function () {
    autoExpand(windu);
  };
};

var autoExpand = function (windu) {
  if (windu.scrollWidth > windu.clientWidth) {
    windu.style.width = 'auto';
  }
  if (windu.scrollHeight > windu.clientHeight) {
    windu.style.height = 'auto';
  }
};

var checkOverflow = function (windu, expander) {
  if (!expander) {
    expander = windu.childNodes[0].childNodes[1];
  }
  if (windu.scrollWidth > windu.clientWidth || windu.scrollHeight > windu.clientHeight) {
    expander.style.background = '#4b4';
    expander.style.border = '2px solid #000';
    expander.style.color = '#000';
  } else {
    expander.className = '';
    expander.style.background = '#000';
    expander.style.border = '2px solid #4b4';
    expander.style.color = '#4b4';
  }
  if (windu.scrollWidth > windu.clientWidth && windu.scrollHeight <= windu.clientHeight) {
    expander.innerText = '▶';
  } else {
    expander.innerText = '▼';
  }
};

var bringToFront = function (el) {
  if (el.style.zIndex <= window.zMax) {
    el.style.zIndex = window.zMax + 1;
    window.zMax = parseInt(el.style.zIndex);
  }
};

var openWindow = function (windowName) {
  var windu;
  windu = document.getElementById(windowName);
  windu.style.display = 'block';
  windu.className = 'open';
  checkOverflow(windu);
  setTimeout(function () {
    bringToFront(windu);
  }, 20);
};

var closeWindow = function (windowName) {
  var windu;
  windu = document.getElementById(windowName);
  windu.style.display = 'none';
  windu.className = 'closed';
};
