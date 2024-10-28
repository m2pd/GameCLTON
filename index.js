let gameInterval; // Khai báo gameInterval ở phạm vi toàn cục
let remainingGames = 0; // Biến lưu số lượt chơi còn lại

// Khôi phục số lần thử từ sessionStorage nếu có
// if (sessionStorage.getItem('attempts')) {
//   attempts = Number(sessionStorage.getItem('attempts'));
// }

// // Khôi phục số lượt chơi còn lại từ sessionStorage nếu có
// if (sessionStorage.getItem('remainingGames')) {
//   remainingGames = Number(sessionStorage.getItem('remainingGames'));
// }

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const clickElement = (element) => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};

// Hàm mô phỏng nhấn phím F5
function simulateF5() {
  // sessionStorage.setItem('attempts', attempts); // Lưu số lần thử vào sessionStorage
  // sessionStorage.setItem('remainingGames', remainingGames); // Lưu số lượt chơi còn lại
  window.location.reload(); // Tải lại trang
}

function getNumberGame() {
  return Number(
    document.querySelectorAll('.user-stats-detail p')[1].textContent
  );
}

// Hàm kiểm tra sự tồn tại của class "boost_wrapper"
const checkBoostWrapper = () => {
  return document.querySelector('.boost_wrapper') !== null;
};

// Function để bắt đầu trò chơi
function startGame() {
  const numberOfGames = getNumberGame(); // Lấy số lượt chơi còn lại
  console.log('Số lượt chơi ban đầu: ', numberOfGames);
  // Nếu còn nhiều hơn 0 lượt chơi và nhỏ hơn hoặc bằng numberOfGames, thì cho phép chơi hết các lượt còn lại
  if (numberOfGames > 0) {
    remainingGames = Math.min(numberOfGames, numberOfGames - 1); // Giới hạn số lượt chơi không quá numberOfGames
    // sessionStorage.setItem('remainingGames', remainingGames); // Lưu số lượt chơi còn lại

    playNextGame(); // Bắt đầu chơi game
  } else {
    console.warn('Không còn lượt chơi nào.');
  }
}

async function playNextGame() {
  let attempts = 0; // Số lần thử
  const maxAttempts = 10; // Số lần thử tối đa

  // Hàm kiểm tra sự tồn tại của class "boost_wrapper"
  const checkBoostWrapper = () => {
    return document.querySelector('.boost_wrapper') !== null;
  };

  await sleep(2000);
  const elementGame = document.querySelector('a.menu-button[href="/games"]');
  if (elementGame) {
    clickElement(elementGame);
  } else {
    console.error('Phần tử không tồn tại:', elementGame);
  }

  // Hàm thực hiện click và kiểm tra
  async function tryClickPlay() {
    if (attempts >= maxAttempts) {
      console.warn('Đã thử quá số lần cho phép. Dừng lại.');
      return;
    }

    attempts++;
    console.log(`Thử lần ${attempts}: Nhấn nút Play`);
    await sleep(5000);
    const playButton = document.querySelector('.game-item .game-item-link');
    if (playButton) {
      clickElement(playButton); // Nhấn nút Play
      await sleep(2000); // Chờ 2 giây trước khi kiểm tra
      console.log('Chờ 3s kiểm tra Bắt đầu game.');
      // Kiểm tra nếu class "boost_wrapper" xuất hiện sau khi nhấn Play
      if (checkBoostWrapper()) {
        console.log('Đã tìm thấy class "boost_wrapper". Bắt đầu game.');
        gameInterval = setInterval(async () => {
          await main();
        }, 700);
      } else {
        console.warn('Không tìm thấy class "boost_wrapper", thử lại...');
        //Go tab Home
        await sleep(1000);
        clickElement(document.querySelector('a.menu-button[href="/"]'));
        await sleep(1000);

        //Go rtag game
        clickElement(document.querySelector('a.menu-button[href="/games"]'));
        await sleep(2000);
        await tryClickPlay(); // Thử lại nếu chưa tìm thấy
      }
    } else {
      console.warn('Không tìm thấy nút Play!');
    }
  }

  // Bắt đầu lần thử đầu tiên
  await tryClickPlay();
}

async function main() {
  await sleep(1000);
  // Kiểm tra nếu có phần tử với class "claim-reward"
  let backElement = document.querySelector('.back-to-menu');
  if (backElement) {
    clearInterval(gameInterval); // Dừng setInterval
    console.log('Game dừng lại vì có phần tử với class "claim-reward"');
    let bootReward = document.querySelector('.reward-badge.channel');
    if (bootReward) {
      clickElement(bootReward);
    }
    clickElement(backElement);

    await sleep(3000);
    remainingGames--; // Giảm số lượt chơi còn lại
    console.log(`Lượt chơi còn lại: ${remainingGames}`);

    // Nếu còn lượt chơi, tiếp tục chơi lượt tiếp theo
    if (remainingGames > 0) {
      setTimeout(playNextGame, 2000); // Đợi 2 giây trước khi bắt đầu lượt tiếp theo
    } else {
      console.log('Đã chơi hết tất cả các lượt.');
    }
    return; // Thoát khỏi hàm main
  }

  let game_matrix = getMatrixGame();
  let max_hold = 0;
  let best_direction = '';

  if (hamGiaLap(game_matrix, 'up') > max_hold) {
    max_hold = hamGiaLap(game_matrix, 'up');
    best_direction = 'up';
  }
  if (hamGiaLap(game_matrix, 'down') > max_hold) {
    max_hold = hamGiaLap(game_matrix, 'down');
    best_direction = 'down';
  }
  if (hamGiaLap(game_matrix, 'left') > max_hold) {
    max_hold = hamGiaLap(game_matrix, 'left');
    best_direction = 'left';
  }
  if (hamGiaLap(game_matrix, 'right') > max_hold) {
    max_hold = hamGiaLap(game_matrix, 'right');
    best_direction = 'right';
  }

  if (
    hamGiaLap(game_matrix, 'up') == hamGiaLap(game_matrix, 'down') &&
    hamGiaLap(game_matrix, 'down') == hamGiaLap(game_matrix, 'left') &&
    hamGiaLap(game_matrix, 'left') == hamGiaLap(game_matrix, 'right')
  ) {
    switch (randomInt(0, 4)) {
      case 0:
        best_direction = 'up';
        break;
      case 1:
        best_direction = 'down';
        break;
      case 2:
        best_direction = 'left';
        break;
      case 3:
        best_direction = 'right';
        break;
    }
  }

  hamMoveArrayKeyboard(best_direction);
}

function getMatrixGame() {
  let game_matrix;
  let all_tile;

  // Lấy tất cả các phần tử có class 'tile'
  all_tile = document.querySelectorAll('.tile');

  // Tạo mảng 4x4 trống
  game_matrix = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];

  // Duyệt qua từng phần tử .tile
  all_tile.forEach((e) => {
    // Lấy giá trị từ class thứ hai, chứa giá trị của ô
    let class_contain_value = e.classList[1]; // Ví dụ: 'tile2', 'tile4', 'tile8'
    // console.log("Value class:", class_contain_value);  // Kiểm tra giá trị class

    if (class_contain_value && /\d/.test(class_contain_value)) {
      let value = parseInt(class_contain_value.replace(/\D/g, ''), 10);

      // Lấy tọa độ từ class thứ ba, ví dụ 'position_2_3'
      let class_contain_position = e.classList[2];
      // console.log("Position class:", class_contain_position);  // In ra class position để kiểm tra

      if (
        class_contain_position &&
        class_contain_position.startsWith('position_')
      ) {
        let position = class_contain_position
          .replace('position_', '')
          .split('_'); // Ví dụ: ['2', '3']
        // console.log("Split position:", position);  // In ra vị trí sau khi split

        if (position.length === 2) {
          let row_position = parseInt(position[0], 10); // Vị trí hàng
          let col_position = parseInt(position[1], 10); // Vị trí cột

          // Kiểm tra nếu giá trị của hàng và cột hợp lệ
          if (!isNaN(row_position) && !isNaN(col_position)) {
            // console.log(`Setting value ${value} at [${row_position}, ${col_position}]`);
            game_matrix[row_position][col_position] = value; // Cập nhật vào game_matrix
          } else {
            console.warn('Invalid row or column position');
          }
        } else {
          console.warn('Position format is incorrect');
        }
      } else {
        console.warn('Class for position not found or incorrect');
      }
    } else {
      console.warn('Value class is invalid');
    }
  });

  // In ra ma trận sau khi cập nhật
  // console.table(game_matrix);
  return game_matrix;
}

function randomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function hamMoveArrayKeyboard(direction) {
  let key;

  // Xác định phím mũi tên dựa trên hướng
  switch (direction) {
    case 'left':
      key = 'ArrowLeft';
      break;
    case 'up':
      key = 'ArrowUp';
      break;
    case 'right':
      key = 'ArrowRight';
      break;
    case 'down':
      key = 'ArrowDown';
      break;
    default:
      return; // Không làm gì nếu direction không hợp lệ
  }

  // Tạo sự kiện KeyboardEvent cho keydown
  let event = new KeyboardEvent('keydown', {
    key: key,
    keyCode:
      key === 'ArrowLeft'
        ? 37
        : key === 'ArrowUp'
        ? 38
        : key === 'ArrowRight'
        ? 39
        : 40, // ArrowDown = 40
    code: key,
    which:
      key === 'ArrowLeft'
        ? 37
        : key === 'ArrowUp'
        ? 38
        : key === 'ArrowRight'
        ? 39
        : 40, // ArrowDown = 40
    bubbles: true, // Cho phép sự kiện nổi lên
    cancelable: true, // Cho phép sự kiện có thể bị hủy
  });

  // Dispatch sự kiện keydown
  document.dispatchEvent(event);
}

function hamRutGonArray1DTheoRule2048(input) {
  if (input.length === 0) return input;
  a = [...input];
  // a=[2,1,1,1,2,2,3,4,5,7]
  b = [a[0]];

  let isCheck = true;
  for (let i = 1; i <= a.length - 1; i++) {
    if (isCheck) {
      if (a[i] !== a[i - 1]) {
        b.push(a[i]);
      } else {
        isCheck = false;
      }
    } else {
      b.push(a[i]);
      isCheck = true;
    }
  }
  return b;
}

function hamGiaLap(game_matrix, direction) {
  let game_matrix_test = [
    [...game_matrix[0]],
    [...game_matrix[1]],
    [...game_matrix[2]],
    [...game_matrix[3]],
  ];
  let game_matrix_test_transpose = [
    [...game_matrix[0]],
    [...game_matrix[1]],
    [...game_matrix[2]],
    [...game_matrix[3]],
  ];
  switch (direction) {
    case 'left':
      //day tat ca sang trai
      for (let iHang = 0; iHang < 4; iHang++) {
        let row = game_matrix_test[iHang];

        var new_row_1 = []; //value khac 0
        var new_row_2 = []; //value bang 0
        row.forEach((e) => {
          if (e) new_row_1.push(e);
          else new_row_2.push('');
        });
        //rut gon array
        new_row_1_shorten = hamRutGonArray1DTheoRule2048(new_row_1);
        //console.log({new_row_1_shorten,new_row_1})
        for (
          let ishorten = 0;
          ishorten < new_row_1.length - new_row_1_shorten.length;
          ishorten++
        ) {
          new_row_2.push('');
        }
        row = [...new_row_1_shorten, ...new_row_2];
        game_matrix_test[iHang] = row;
      }
      break;
    case 'right':
      //day tat ca sang phai
      for (let iHang = 0; iHang < 4; iHang++) {
        let row = game_matrix_test[iHang];

        var new_row_1 = []; //value khac 0
        var new_row_2 = []; //value bang 0
        row.forEach((e) => {
          if (e) new_row_1.push(e);
          else new_row_2.push('');
        });
        //rut gon array
        new_row_1_shorten = hamRutGonArray1DTheoRule2048(new_row_1);
        //console.log({new_row_1_shorten,new_row_1})
        for (
          let ishorten = 0;
          ishorten < new_row_1.length - new_row_1_shorten.length;
          ishorten++
        ) {
          new_row_2.push('');
        }

        row = [...new_row_2, ...new_row_1_shorten];
        game_matrix_test[iHang] = row;
      }
      break;

    case 'up':
      //day tat ca len tren
      for (let iCot = 0; iCot < 4; iCot++) {
        let col = game_matrix_test.map((row) => {
          return row[iCot];
        });

        var new_col_1 = []; //value khac 0
        var new_col_2 = []; //value bang 0
        col.forEach((e) => {
          if (e) new_col_1.push(e);
          else new_col_2.push('');
        });
        //rut gon array
        new_col_1_shorten = hamRutGonArray1DTheoRule2048(new_col_1);
        // console.log({new_col_1_shorten,new_col_1})

        for (
          let ishorten = 0;
          ishorten < new_col_1.length - new_col_1_shorten.length;
          ishorten++
        ) {
          new_col_2.push('');
        }

        col = [...new_col_1_shorten, ...new_col_2];
        game_matrix_test_transpose[iCot] = col;
      }
      game_matrix_test = transpose(game_matrix_test_transpose);

      break;

    case 'down':
      //day tat ca xuong duoi
      for (let iCot = 0; iCot < 4; iCot++) {
        let col = game_matrix_test.map((row) => {
          return row[iCot];
        });

        var new_col_1 = []; //value khac 0
        var new_col_2 = []; //value bang 0
        col.forEach((e) => {
          if (e) new_col_1.push(e);
          else new_col_2.push('');
        });

        //rut gon array
        new_col_1_shorten = hamRutGonArray1DTheoRule2048(new_col_1);
        // console.log({new_col_1_shorten,new_col_1})
        for (
          let ishorten = 0;
          ishorten < new_col_1.length - new_col_1_shorten.length;
          ishorten++
        ) {
          new_col_2.push('');
        }

        col = [...new_col_2, ...new_col_1_shorten];
        game_matrix_test_transpose[iCot] = col;
      }
      game_matrix_test = transpose(game_matrix_test_transpose);

      break;
  }

  return calc_total_hold(game_matrix_test);
}
function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
}

function calc_total_hold(game_matrix) {
  return game_matrix.reduce((total_hold, row) => {
    total_hold_each_row = row.reduce((total, e) => {
      if (!e) return total + 1;
      else return total;
    }, 0);

    return total_hold + total_hold_each_row;
  }, 0);
}

startGame();
