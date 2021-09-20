class Input {
  static gamepads = [{ buttons: [] }, {}, {}, {}];
  static keyboard = [];

  static aliasKeyboard = {
    39: 'right',
    37: 'left',
    40: 'down',
    38: 'up',

    90: 'a', //z
    88: 'b', //x
    32: 'x', //space
    27: 'y', //esc

    54: 'lbm', //6
    55: 'rbm', //7

    81: 'lb', //q;
    69: 'rb', //e;

    112: 'select', //f1
    113: 'start', //f2

    91: 'menu' //Super
  };

  static aliasGamepad = {
    15: 'right',
    14: 'left',
    13: 'down',
    12: 'up',

    0: 'a',
    1: 'b',
    2: 'x',
    3: 'y',

    10: 'lbm',
    11: 'rbm',

    4: 'lb',
    5: 'rb',

    6: 'lt',
    7: 'rt',

    8: 'select',
    9: 'start',

    16: 'menu'
  }

  static finalInput = {
    'up': { hold: false, tap: 0, gmpd: false, kbd: false },
    'down': { hold: false, tap: 0, gmpd: false, kbd: false },
    'left': { hold: false, tap: 0, gmpd: false, kbd: false },
    'right': { hold: false, tap: 0, gmpd: false, kbd: false },
    'a': { hold: false, tap: 0, gmpd: false, kbd: false },
    'b': { hold: false, tap: 0, gmpd: false, kbd: false },
    'x': { hold: false, tap: 0, gmpd: false, kbd: false },
    'y': { hold: false, tap: 0, gmpd: false, kbd: false },
    'lbm': { hold: false, tap: 0, gmpd: false, kbd: false },
    'rbm': { hold: false, tap: 0, gmpd: false, kbd: false },
    'lb': { hold: false, tap: 0, gmpd: false, kbd: false },
    'rb': { hold: false, tap: 0, gmpd: false, kbd: false },
    'lt': { hold: false, tap: 0, gmpd: false, kbd: false },
    'rt': { hold: false, tap: 0, gmpd: false, kbd: false },
    'select': { hold: false, tap: 0, gmpd: false, kbd: false },
    'start': { hold: false, tap: 0, gmpd: false, kbd: false },
    'menu': { hold: false, tap: 0, gmpd: false, kbd: false }
  }

  static action(w) {
    try {
      return this.finalInput[w].tap == 1;
    } catch (e) {
      return false;
    }
  }

  static hold(w) {
    try {
      return this.finalInput[w].tap >= 1;
    } catch {
      return false;
    }
  }

  static axes(w) {
    try {
      return this.gamepads[0].axes[w];
    } catch {
      return 0;
    }
  }

  static onGamepadButton(id, btn) {
    if (!this.finalInput[this.aliasGamepad[id]].kbd) {
      if (btn.touched) {
        this.finalInput[this.aliasGamepad[id]].hold = true;;
        this.finalInput[this.aliasGamepad[id]].gmpd = true;
      } else {
        this.finalInput[this.aliasGamepad[id]].hold = false;;
        this.finalInput[this.aliasGamepad[id]].gmpd = false;

      }
    }
  }

  static updateInput() {
    for (let i in Input.finalInput) {
      if (Input.finalInput[i].hold) {
        Input.finalInput[i].tap++;
      } else {
        Input.finalInput[i].tap = 0;
      }
    }
    try {

      for (let i = 0; i < navigator.getGamepads()[0].buttons.length; i++) {
        this.gamepads[0].axes = navigator.getGamepads()[0].axes
        this.onGamepadButton(i, navigator.getGamepads()[0].buttons[i]);
      }

      f
    } catch (e) {
    }
  }

  static onKeyInput(e) {
    try {
      if (!Input.finalInput[Input.aliasKeyboard[e.keyCode]].gmpd) {
        Input.finalInput[Input.aliasKeyboard[e.keyCode]].hold = true;
        Input.finalInput[Input.aliasKeyboard[e.keyCode]].kbd = true;
      }
    } catch (e) {
    }
  }

  static onKeyUp(e) {
    try {
      if (!this.finalInput[this.aliasKeyboard[e.keyCode]].gmpd) {
        this.finalInput[this.aliasKeyboard[e.keyCode]].hold = false;
        this.finalInput[this.aliasKeyboard[e.keyCode]].kbd = false;
      }
    } catch (e) {
    }
  }
}

document.addEventListener('keydown', (e) => {
  Input.onKeyInput(e);
})

window.addEventListener('keyup', (e) => {
  Input.onKeyUp(e);
})