const desktop = document.getElementById("desktop");

const windows = {
  files: document.getElementById("window-files"),
  notes: document.getElementById("window-notes"),
  terminal: document.getElementById("window-terminal"),
  settings: document.getElementById("window-settings")
};

const taskApps = document.getElementById("task-apps");

let z = 10;

let openApps = new Set();


/* ================= APP MANAGEMENT ================= */

function openApp(name) {

  const w = windows[name];

  if (!w) return;

  w.classList.add("open");

  w.classList.remove("minimized");

  w.style.zIndex = ++z;

  openApps.add(name);

  refreshTasks();
}


function closeApp(name) {

  windows[name].classList.remove(
    "open",
    "minimized"
  );

  openApps.delete(name);

  refreshTasks();
}


function minimizeApp(name) {

  windows[name].classList.add("minimized");

  refreshTasks();
}


/* ================= TASKBAR ================= */

function refreshTasks() {

  taskApps.innerHTML = "";

  [...openApps].forEach(name => {

    const button =
      document.createElement("button");

    button.className = "task active";

    button.textContent = {

      files: "📁 Files",
      notes: "📝 Notes",
      terminal: "⌘ Terminal",
      settings: "⚙️ Settings"

    }[name];


    button.onclick = () => {

      const w = windows[name];

      w.classList.toggle("minimized");

      if (!w.classList.contains("minimized")) {
        w.style.zIndex = ++z;
      }

    };


    taskApps.appendChild(button);

  });

}


/* ================= OPEN BUTTONS ================= */

document
  .querySelectorAll("[data-open]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openApp(button.dataset.open);

        document
          .getElementById("start-menu")
          .classList.add("hidden");

      }
    );

  });


/* ================= WINDOW CONTROLS ================= */

Object.entries(windows).forEach(
  ([name, w]) => {

    w.querySelector(".close")
      .onclick = () => closeApp(name);

    w.querySelector(".min")
      .onclick = () => minimizeApp(name);


    w.addEventListener(
      "mousedown",
      () => {

        w.style.zIndex = ++z;

      }
    );


    /* DRAGGING */

    const bar = w.querySelector(".titlebar");

    let dragging = false;

    let dx = 0;
    let dy = 0;


    bar.addEventListener(
      "pointerdown",
      event => {

        dragging = true;

        dx =
          event.clientX -
          w.offsetLeft;

        dy =
          event.clientY -
          w.offsetTop;

        bar.setPointerCapture(
          event.pointerId
        );

      }
    );


    bar.addEventListener(
      "pointermove",
      event => {

        if (!dragging) return;


        const maxX =
          innerWidth -
          w.offsetWidth;

        const maxY =
          innerHeight -
          80 -
          w.offsetHeight;


        w.style.left =
          Math.max(
            0,
            Math.min(
              maxX,
              event.clientX - dx
            )
          ) + "px";


        w.style.top =
          Math.max(
            0,
            Math.min(
              maxY,
              event.clientY - dy
            )
          ) + "px";

      }
    );


    bar.addEventListener(
      "pointerup",
      () => {

        dragging = false;

      }
    );

  }
);


/* ================= START MENU ================= */

const start =
  document.getElementById("start");

const menu =
  document.getElementById("start-menu");


start.onclick = () => {

  menu.classList.toggle("hidden");

};


document.addEventListener(
  "pointerdown",
  event => {

    if (
      !menu.contains(event.target) &&
      event.target !== start
    ) {

      menu.classList.add("hidden");

    }

  }
);


/* ================= NOTES ================= */

const notes =
  document.getElementById("notes");


notes.value =
  localStorage.getItem(
    "nikssxelo_notes"
  ) || "";


notes.addEventListener(
  "input",
  () => {

    localStorage.setItem(
      "nikssxelo_notes",
      notes.value
    );

  }
);


/* ================= TERMINAL ================= */

const output =
  document.getElementById(
    "terminal-output"
  );

const command =
  document.getElementById("command");


command.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Enter")
      return;


    const c =
      command.value.trim();

    command.value = "";


    output.innerHTML +=
      `<br>
      <span style="color:var(--accent)">
      nikssxelo@os:~$
      </span>
      ${escapeHtml(c)}
      <br>`;


    const responses = {

      help:
        "Commands: help, clear, date, whoami, apps, neofetch",

      whoami:
        "nikssxelo — user",

      apps:
        "Files | Notes | Terminal | Settings",

      neofetch:
        "NIKSSXELO OS v1.0<br>" +
        "Browser Kernel • Web UI • Local Storage",

      date:
        new Date().toString()

    };


    if (c === "clear") {

      output.innerHTML = "";

    } else {

      output.innerHTML +=
        (
          responses[c] ||
          `Command not found: ${escapeHtml(c)}`
        ) + "<br>";

    }


    output.parentElement.scrollTop =
      output.parentElement.scrollHeight;

  }
);


function escapeHtml(text) {

  return text.replace(
    /[&<>"']/g,
    character => ({

      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"

    }[character])
  );

}


/* ================= SETTINGS ================= */

function applySettings() {

  const accent =
    localStorage.getItem(
      "nikssxelo_accent"
    ) || "#5b8cff";


  const wallpaper =
    localStorage.getItem(
      "nikssxelo_wall"
    ) || "night";


  desktop.style.setProperty(
    "--accent",
    accent
  );


  document.getElementById(
    "accent"
  ).value = accent;


  document.getElementById(
    "wallpaper"
  ).value = wallpaper;


  if (wallpaper === "blue") {

    desktop.style.background =
      "radial-gradient(circle at 70% 20%, #183c70, #081426 45%, #02050a)";

  }

  else if (wallpaper === "void") {

    desktop.style.background =
      "#020204";

  }

  else {

    desktop.style.background =
      "radial-gradient(circle at 70% 20%, #17264a 0, #0a1020 30%, #03050b 72%)";

  }

}


document.getElementById(
  "accent"
).oninput = event => {

  localStorage.setItem(
    "nikssxelo_accent",
    event.target.value
  );

  applySettings();

};


document.getElementById(
  "wallpaper"
).onchange = event => {

  localStorage.setItem(
    "nikssxelo_wall",
    event.target.value
  );

  applySettings();

};


document.getElementById(
  "reset"
).onclick = () => {

  localStorage.removeItem(
    "nikssxelo_accent"
  );

  localStorage.removeItem(
    "nikssxelo_wall"
  );

  applySettings();

};


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


setInterval(updateClock, 1000);

updateClock();

applySettings();


/* ================= BOOT ================= */

let progress = 0;


const boot =
  setInterval(() => {

    progress += 2;


    document.getElementById(
      "boot-progress"
    ).style.width =
      progress + "%";


    if (progress >= 100) {

      clearInterval(boot);


      setTimeout(() => {

        document
          .getElementById("boot")
          .remove();


        desktop
          .classList
          .remove("hidden");


      }, 250);

    }

  }, 35);
