class Timer {
  constructor() {
    this.__start = null;
    this.__end = null;
  }

  __now() {
    return performance.now()
  }

  __format_time() {
    if (this.__end === null) return "";
    const duration = (this.__end - this.__start) / 1000;
    return duration.toFixed(3);
  }

  start() {
    this.__start = this.__now();
  }

  perf() {
    this.__end = this.__now();
    const format = this.__format_time();
    this.__start = null;
    this.__end = null;
    return format;
  }
}


class Game {
  constructor(timer) {
    this.__ids = [];
    this.__timeout = 2000;
    this.__timer = timer;

    this.__message = document.getElementById("message");
    this.__message_txt = "Press the circle to play";

    this.__button = document.getElementById("play");
    this.__button.style.display = 'block';
  }

  __shuffle(array) {
    //Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  __generate(number_of_elements, start = 0) {
      let array = [];
      while (array.length < number_of_elements) {
        array.push(start++);
      }

      return array;
  }

  __set_cell(id, value) {
    document.getElementById(id).innerHTML = value;
  }

  __clear_listeners() {
    this.__ids.forEach(id => {
      let cell = document.getElementById(id);
      cell.classList.remove('cover');
      cell.removeEventListener('click', this.__callback);
    });
  }

  __clear_text() {
    this.__ids.forEach(id => {
      let cell = document.getElementById(id);
      cell.innerHTML = '';
    });
  }

  __switch() {
    this.__button.style.display = this.__button.style.display === 'block' ? 'none' : 'block';
  }

  __callback = (event) => this.__play(event);

  __end_win() {
    this.__message.innerText = `You Win!! Your time is ${this.__timer.perf()} s.`;
    this.__switch();
  }

  __end_lose() {
    this.__message.innerHTML = `You Lost :( Your time is ${this.__timer.perf()} s.`;
    this.__clear_listeners();

    setTimeout(() => {
      this.__clear_text();
      this.__switch();
      this.__ids = [];
      this.__message.innerHTML = this.__message_txt;
    }, this.__timeout)
  }


  __play(event) {
    let clicked_number = parseInt(event.target.id, 10);
    let valid_number = this.__ids.pop();

    if (valid_number == clicked_number) {
      event.target.classList.remove('cover');
      event.target.removeEventListener('click', this.__callback);
      event.target.innerHTML = '';

      if (this.__ids.length == 0) {
        this.__end_win();
      }

      return;
    }

    this.__ids.push(valid_number);
    this.__end_lose();
  };

  __set() {
    let positions = this.__generate(60);
    this.__ids = this.__shuffle(positions).slice(0, 9);

    let i = 9;
    this.__ids.forEach(id => {
      let cell = document.getElementById(id);
      cell.innerHTML = i;
      i--;
    });

    this.__switch();

    setTimeout(() => {
      this.__ids.forEach(id => {
        let cell = document.getElementById(id)
        cell.classList.add('cover');
        cell.addEventListener('click', this.__callback);
      });
      this.__timer.start();
    }, this.__timeout);
  };

  listen() {
    this.__button.addEventListener('click', () => this.__set());
  };
};


let timer = new Timer();
let game = new Game(timer);
game.listen();
