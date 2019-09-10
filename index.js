let full_array = [9, 8, 7, 6, 5, 4, 3, 2, 1];
const timeout = 2000; // milliseconds
let start_time = 0;

const message = document.getElementById('game-message');
const play_button = document.getElementById('play-button');
play_button.style.display = 'block';

const gen_array = function (number_of_elements, start = 0) {
  let array = [];

  while (array.length < number_of_elements) {
    array.push(start++);
  }

  return array;
}

const set_cell = function (position, value) {
  document.getElementById(position).innerHTML = value;
}

const clear_cells = function () {
  for (let i = 0; i < 60; i++) {
    let cell = document.getElementById(i);
    cell.innerHTML = '';
    cell.classList.remove('cover');
    cell.removeEventListener('click', play_game);
  }
}

const shuffle = function (array) {
  //Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function toggle_button() {
  play_button.style.display = (play_button.style.display == 'block') ? 'none' : 'block';
}

const set_game = function () {
  message.innerText = '';
  full_array = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  clear_cells();
  values = shuffle(gen_array(9, 1));
  position = shuffle(gen_array(60)).slice(0, 9);

  for (let i = 0; i < 9; i++) {
    set_cell(position[i], values[i]);
  }

  toggle_button();

  setTimeout(() => {
    for (let i = 0; i < 9; i++) {
      let cell = document.getElementById(position[i])
      cell.classList.add('cover');
      cell.addEventListener('click', play_game);
    }

    start_time = performance.now();
  }, timeout);

}

const reset_game = function () {
  clear_cells();
  toggle_button();
}

const format_time = function (start, stop) {
  let duration = (stop - start) / 1000;
  return duration.toFixed(3);
}

const play_game = function () {
  let clicked_number = parseInt(event.target.innerHTML, 10);
  let valid_number = full_array.pop();

  if (valid_number == clicked_number) {
    event.target.innerHTML = '';
    event.target.classList.remove('cover');
    event.target.removeEventListener('click', play_game);

    if (full_array.length == 0) {
      let stop_time = performance.now();
      message.innerText = `You Win!! Your time is ${format_time(start_time, stop_time)} s.`;
      reset_game();
    }
  } else {
    let stop_time = performance.now();
    message.innerHTML = `You Lost :( Your time is ${format_time(start_time, stop_time)} s.`;
    reset_game();
  }
}

play_button.addEventListener('click', function () { set_game() });
