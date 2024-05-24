
class InputManager extends EventTarget {
  constructor() {
    super();
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
    this._moving = "none";
    // Support WASD as arrows
    this.keyMap = {
        "w": "ArrowUp",
        "a": "ArrowLeft",
        "s": "ArrowDown",
        "d": "ArrowRight",
    };
  }

  keyDown(ev) {
    let key = ev.key;
    // Look up if mapped key press
    if (this.keyMap[key]) {
      key = this.keyMap[key];
    }

    // Handle all arrow key directions as movement
    if (key.startsWith("Arrow")) {
      this.moving = key.toLowerCase().replace("arrow", "");
    }
  }

  keyUp(ev) {
    this.moving = "none";
  }

  get moving() {
    return this._moving;
  }

  set moving(value) {
    this._moving = value;
    this.dispatchEvent(new CustomEvent("moving", { detail: value }));
  }
}


const input = new InputManager();
input.addEventListener("moving", (ev) => debug("moving: " + ev.detail));

function debug(msg) {
  console.debug("debug:", msg);
  document.getElementById("debug").innerText = msg;
}
