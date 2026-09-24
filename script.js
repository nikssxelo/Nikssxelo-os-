const desktop = document.getElementById("desktop");

const windows = [
  "files",
  "notes",
  "calculator",
  "terminal",
  "settings",
  "about"
];

let zIndex = 20;


/* ================= BOOT ================= */

let progress = 0;

const bootTimer = setInterval(() => {

  progress += 2;

  document.getElementById("progress")
    .style.width = progress + "%";

  if (progress >= 100) {

    clearInterval(bootTimer);

    setTimeout(() => {

      document.getElementById("boot")
        .remove();

      desktop.classList.remove("hidden");

    }, 300);

  }

}, 35);


/* ================= OPEN APP ================= */

function openApp(name) {

  const win = document.getElementById(name);

  if (!win) return;

  win.classList.add("open");

  win.classList.remove("minimized");

  win.style.zIndex = ++zIndex;

  updateTasks();

}


/* ================= CLOSE ================= */

function closeApp(name) {

  const win = document.getElementById(name);

  win.classList.remove(
    "open",
    "minimized",
    "maximized"
  );

  updateTasks();

}


/* ================= MINIMIZE ================= */

function minimizeApp(name) {

  document
    .getElementById(name)
    .classList.add("minimized");

  updateTasks();

}


/* ================= MAXIMIZE ================= */

function maximizeApp(name) {

  const win = document.getElementById(name);

  win.classList.toggle("maximized");

  win.style.zIndex = ++zIndex;

}


/* ================= APP BUTTONS ================= */

document
  .querySelectorAll("[data-app]")
  .forEach(button => {

    button.addEventListener("click", () => {

      openApp(button.dataset.app);

      document
        .getElementById("startMenu")
        .classList.add("hidden");

      document
        .getElementById("desktopMenu")
        .classList.add("hidden");

    });

  });


/* ================= WINDOW BUTTONS ================= */

document
  .querySelectorAll(".window")
  .forEach(win => {

    const name = win.id;

    win.querySelector(".close")
      .onclick = () => closeApp(name);

    win.querySelector(".min")
      .onclick = () => minimizeApp(name);

    win.querySelector(".max")
      .onclick = () => maximizeApp(name);


    win.addEventListener(
      "mousedown",
      () => {

        win.style.zIndex = ++zIndex;

      }
    );


    /* DRAGGING */

    const titlebar =
      win.querySelector(".titlebar");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    titlebar.addEventListener(
      "pointerdown",
      event => {

        if (
          event.target.tagName === "BUTTON"
        ) return;

        if (
          win.classList.contains("maximized")
        ) return;

        dragging = true;

        offsetX =
          event.clientX -
          win.offsetLeft;

        offsetY =
          event.clientY -
          win.offsetTop;

        titlebar.setPointerCapture(
          event.pointerId
        );

      }
    );


    titlebar.addEventListener(
      "pointermove",
      event => {

        if (!dragging) return;

        const maxX =
          innerWidth -
          win.offsetWidth;

        const maxY =
          innerHeight -
          70 -
          win.offsetHeight;


        win.style.left =
          Math.max(
            0,
            Math.min(
              maxX,
              event.clientX - offsetX
            )
          ) + "px";


        win.style.top =
          Math.max(
            0,
            Math.min(
              maxY,
              event.clientY - offsetY
            )
          ) + "px";

      }
    );


    titlebar.addEventListener(
      "pointerup",
      () => {

        dragging = false;

      }
    );

  });


/* ================= TASKBAR ================= */

function updateTasks() {

  const container =
    document.getElementById("taskApps");

  container.innerHTML = "";

  windows.forEach(name => {

    const win =
      document.getElementById(name);

    if (
      win.classList.contains("open")
    ) {

      const button =
        document.createElement("button");

      button.className = "task";

      const names = {

        files: "📁 Files",
        notes: "📝 Notes",
        calculator: "🧮 Calculator",
        terminal: "⌘ Terminal",
        settings: "⚙️ Settings",
        about: "ℹ️ About"

      };

      button.textContent =
        names[name];


      button.onclick = () => {

        if (
          win.classList.contains("minimized")
        ) {

          win.classList.remove("minimized");

          win.style.zIndex = ++zIndex;

        } else {

          win.classList.add("minimized");

        }

      };


      container.appendChild(button);

    }

  });

}


/* ================= START MENU ================= */

const startButton =
  document.getElementById("startButton");

const startMenu =
  document.getElementById("startMenu");


startButton.onclick = event => {

  event.stopPropagation();

  startMenu.classList.toggle("hidden");

};


document.addEventListener(
  "click",
  event => {

    if (
      !startMenu.contains(event.target) &&
      event.target !== startButton
    ) {

      startMenu.classList.add("hidden");

    }

  }
);


/* ================= SEARCH ================= */

document
  .getElementById("appSearch")
  .addEventListener("input", event => {

    const search =
      event.target.value.toLowerCase();

    document
      .querySelectorAll("#appList button")
      .forEach(button => {

        button.style.display =
          button.textContent
            .toLowerCase()
            .includes(search)
              ? "block"
              : "none";

      });

  });


/* ================= NOTES STORAGE ================= */

const noteBox =
  document.getElementById("noteBox");


noteBox.value =
  localStorage.getItem(
    "nikssxelo_notes"
  ) || "";


noteBox.addEventListener(
  "input",
  () => {

    localStorage.setItem(
      "nikssxelo_notes",
      noteBox.value
    );

  }
);


/* ================= CALCULATOR ================= */

const calcDisplay =
  document.getElementById("calcDisplay");


function addCalc(value) {

  calcDisplay.value += value;

}


function clearCalc() {

  calcDisplay.value = "";

}


function backCalc() {

  calcDisplay.value =
    calcDisplay.value.slice(0, -1);

}


function calculate() {

  try {

    if (!/^[0-9+\-*/.() ]+$/.test(
      calcDisplay.value
    )) {

      throw new Error();

    }

    calcDisplay.value =
      Function(
        "return " +
        calcDisplay.value
      )();

  }

  catch {

    calcDisplay.value = "Error";

  }

}


/* ================= TERMINAL ================= */

const terminalInput =
  document.getElementById(
    "terminalInput"
  );

const terminalOutput =
  document.getElementById(
    "terminalOutput"
  );


terminalInput.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Enter")
      return;


    const command =
      terminalInput.value.trim()
        .toLowerCase();


    terminalInput.value = "";


    terminalOutput.innerHTML +=
      `<br>
      <span style="color:var(--accent)">
      nikssxelo@os:~$
      </span>
      ${escapeHTML(command)}
      <br>`;


    const commands = {

      help:
        "Available: help, clear, date, whoami, apps, neofetch, open",

      whoami:
        "nikssxelo",

      apps:
        "Files | Notes | Calculator | Terminal | Settings | About",

      neofetch:
        "NIKSSXELO OS<br>" +
        "Browser-based desktop<br>" +
        "Local Storage enabled",

      date:
        new Date().toString()

    };


    if (command === "clear") {

      terminalOutput.innerHTML = "";

    }

    else if (
      command.startsWith("open ")
    ) {

      const app =
        command.substring(5);

      const aliases = {
        file: "files",
        files: "files",
        note: "notes",
        notes: "notes",
        calculator: "calculator",
        calc: "calculator",
        terminal: "terminal",
        settings: "settings",
        about: "about"
      };

      if (aliases[app]) {

        openApp(aliases[app]);

        terminalOutput.innerHTML +=
          "Opening " +
          escapeHTML(app) +
          "...<br>";

      }

      else {

        terminalOutput.innerHTML +=
          "App not found.<br>";

      }

    }

    else {

      terminalOutput.innerHTML +=
        (
          commands[command] ||
          "Command not found. Type help."
        ) + "<br>";

    }


    document
      .querySelector(".terminal")
      .scrollTop = 99999;

  }
);


function escapeHTML(text) {

  return text.replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char])
  );

}


/* ================= SETTINGS ================= */

const accent =
  document.getElementById("accent");

const wallpaper =
  document.getElementById("wallpaper");


function loadSettings() {

  const savedAccent =
    localStorage.getItem(
      "nikssxelo_accent"
    ) || "#5b8cff";


  const savedWallpaper =
    localStorage.getItem(
      "nikssxelo_wallpaper"
    ) || "night";


  desktop.style.setProperty(
    "--accent",
    savedAccent
  );

  accent.value =
    savedAccent;

  wallpaper.value =
    savedWallpaper;


  applyWallpaper(savedWallpaper);

}


function applyWallpaper(type) {

  if (type === "blue") {

    desktop.style.background =
      "radial-gradient(circle at 70% 20%,#183f78,#071426 48%,#02040a 80%)";

  }

  else if (type === "purple") {

    desktop.style.background =
      "radial-gradient(circle at 70% 20%,#42205f,#12091d 45%,#02040a 80%)";

  }

  else if (type === "void") {

    desktop.style.background =
      "#020204";

  }

  else {

    desktop.style.background =
      "radial-gradient(circle at 75% 20%,#1a2d58,#091120 42%,#02040a 80%)";

  }

}


accent.oninput = event => {

  localStorage.setItem(
    "nikssxelo_accent",
    event.target.value
  );

  desktop.style.setProperty(
    "--accent",
    event.target.value
  );

};


wallpaper.onchange = event => {

  localStorage.setItem(
    "nikssxelo_wallpaper",
    event.target.value
  );

  applyWallpaper(
    event.target.value
  );

};


document
  .getElementById("resetSettings")
  .onclick = () => {

    localStorage.removeItem(
      "nikssxelo_accent"
    );

    localStorage.removeItem(
      "nikssxelo_wallpaper"
    );

    loadSettings();

  };


loadSettings();


/* ================= CLOCK ================= */

function updateClock() {

  document.getElementById(
    "clock"
  ).textContent =
    new Date().toLocaleString(
      [],
      {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

}


setInterval(
  updateClock,
  1000
);

updateClock();


/* ================= RIGHT CLICK ================= */

const desktopMenu =
  document.getElementById(
    "desktopMenu"
  );


desktop.addEventListener(
  "contextmenu",
  event => {

    if (
      event.target.closest(".window") ||
      event.target.closest("#taskbar")
    ) return;

    event.preventDefault();

    desktopMenu.style.left =
      Math.min(
        event.clientX,
        innerWidth - 200
      ) + "px";

    desktopMenu.style.top =
      Math.min(
        event.clientY,
        innerHeight - 180
      ) + "px";

    desktopMenu.classList.remove(
      "hidden"
    );

  }
);


document.addEventListener(
  "click",
  () => {

    desktopMenu.classList.add(
      "hidden"
    );

  }
);


/* ================= LOCK ================= */

const lockScreen =
  document.getElementById(
    "lockScreen"
  );


document
  .getElementById("lockButton")
  .onclick = () => {

    startMenu.classList.add("hidden");

    lockScreen.classList.remove(
      "hidden"
    );

  };


document
  .getElementById("unlockButton")
  .onclick = () => {

    lockScreen.classList.add(
      "hidden"
    );

  };


function updateLockTime() {

  document.getElementById(
    "lockTime"
  ).textContent =
    new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

}


setInterval(
  updateLockTime,
  1000
);

updateLockTime();


/* ================= RESTART ================= */

document
  .getElementById("restartButton")
  .onclick = () => {

    location.reload();

  };


/* ================= SHUTDOWN ================= */

document
  .getElementById("shutdownButton")
  .onclick = () => {

    desktop.innerHTML = `
      <div style="
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#02040a;
        color:#8d98aa;
        font-size:16px;
      ">
        Shutting down...
      </div>
    `;

    setTimeout(() => {

      location.reload();

    }, 2500);

  };
