let data = [
  {
    id: 0,
    name: '肥宅心碎賞櫻3日',
    imgUrl:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80',
    area: '高雄',
    description: '賞櫻花最佳去處。肥宅不得不去的超讚景點！',
    group: 87,
    price: 1400,
    rate: 10,
  },
  {
    id: 1,
    name: '貓空纜車雙程票',
    imgUrl:
      'https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
    area: '台北',
    description:
      '乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感',
    group: 99,
    price: 240,
    rate: 2,
  },
  {
    id: 2,
    name: '台中谷關溫泉會1日',
    imgUrl:
      'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
    area: '台中',
    description:
      '全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。',
    group: 20,
    price: 1765,
    rate: 7,
  },
];

// 定義DOM
const addTicketResultAlert = document.getElementById('addTicketResult-alert');
const addTicketForm = document.querySelector('.addTicket-form');
const ticketTitle = document.getElementById('ticketName');
const ticketImg = document.getElementById('ticketImgUrl');
const ticketLocation = document.getElementById('ticketRegion');
const ticketPrice = document.getElementById('ticketPrice');
const ticketNum = document.getElementById('ticketNum');
const ticketRate = document.getElementById('ticketRate');
const ticketDescription = document.getElementById('ticketDescription');
const addTicketBtn = document.querySelector('.addTicket-btn');
const inputDOMlist = [
  ticketTitle,
  ticketImg,
  ticketLocation,
  ticketPrice,
  ticketNum,
  ticketRate,
  ticketDescription,
];

const ticketCardArea = document.querySelector('.ticketCard-area');
const regionSearch = document.querySelector('.regionSearch');
const searchResultText = document.getElementById('searchResult-text');

addTicketBtn.addEventListener('click', () => validateForm());
regionSearch.addEventListener('change', () => filterResult());
inputDOMlist.forEach(dom =>
  dom.addEventListener('blur', e => showInputAlert(e))
);

// 按下新增套票後，驗證所有input
function validateForm() {
  let result =
    validatePrice() &&
    validateNum() &&
    validateRate() &&
    validateDescription() &&
    validateIsFilled();
  if (!result) {
    showAddTicketResultAlert(false);
    return;
  }
  createItem();
  showAddTicketResultAlert(true);
}

// 表單送出後所彈出的alert提示的消失計時器
let timer;
let startTimer = () => {
  timer = setTimeout(() => {
    addTicketResultAlert.innerHTML = ``;
  }, 3500);
};

// 表單送出後的結果提示
// 每當使用者提交表單，就立即執行stopTimer，使timer需要重新計算
// 這是為了防止使用者快速多次提交表單而造成前一個timer還沒跑完的情況

function showAddTicketResultAlert(result) {
  // timer不能寫在函式裏，像以下程式碼這樣：
  // 原因是只要還沒執行startTimer函式，就不會賦值給timer
  // 所以執行showAddTicketResultAlert後，一開始timer永遠都會是undefined，因此stopTimer函式就沒有效用

  // let timer;
  // let startTimer = () => {
  //   timer = setTimeout( () => {
  //     console.log('end')
  //     addTicketResultAlert.innerHTML = ``
  //   }, 3500)
  // }

  (function stopTimer() {
    clearTimeout(timer);
  })();

  result
    ? (addTicketResultAlert.innerHTML = `<div class="addTicketResult addTicketResult--success"> 成功新增資料！ </div>`)
    : (addTicketResultAlert.innerHTML = `<div class="addTicketResult addTicketResult--fail"> 新增資料失敗！ </div> `);

  startTimer();
}

// 按每一個Input的驗證結果，顯示相應的alert提示
let showInputAlert = e => {
  let id = e.target.id;
  if (id === 'ticketPrice') {
    if (!validatePrice()) {
      document.getElementById(
        'ticketPrice-message'
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i>
        <span>套票金額需要大於或等於0</span>`;
    } else {
      clearInputAlert(id);
    }
  } else if (id === 'ticketNum') {
    if (!validateNum()) {
      document.getElementById(
        'ticketNum-message'
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>套票組數需要大於0</span>`;
    } else {
      clearInputAlert(id);
    }
  } else if (id === 'ticketRate') {
    if (!validateRate()) {
      document.getElementById(
        'ticketRate-message'
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>套票星級需要在1-10之間</span>`;
    } else {
      clearInputAlert(id);
    }
  } else if (id === 'ticketDescription') {
    if (!validateIsFilled(id)) {
      document.getElementById(
        `${id}-message`
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>必填！</span>`;
    } else if (!validateDescription()) {
      document.getElementById(
        'ticketDescription-message'
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>字數不能多於100字</span>`;
    } else {
      clearInputAlert(id);
    }
  }
  // 在這裏驗證一些只需要驗證是否有輸入東西的Input
  else {
    if (!validateIsFilled(id)) {
      document.getElementById(
        `${id}-message`
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>必填！</span>`;
    } else {
      clearInputAlert(id);
    }
  }
};

// 清除該Input的Alert
function clearInputAlert(id) {
  document.getElementById(`${id}-message`).innerHTML = ``;
}

// 驗證金額Input
function validatePrice() {
  return Number(ticketPrice.value) < 0 ? false : true;
}

// 驗證組數Input
function validateNum() {
  return Number(ticketNum.value) <= 0 ? false : true;
}

// 驗證星級Input
function validateRate() {
  return Number(ticketRate.value) < 1 || Number(ticketRate.value) > 10
    ? false
    : true;
}

// 驗證描述Input
function validateDescription() {
  return ticketDescription.value.length > 100 ? false : true;
}

// 驗證所有文字類Input是否有填寫東西
function validateIsFilled(id) {
  // 先判斷是否有傳入id
  // 如果是透過showInputAlert()來執行此函式，就會傳入id
  // 如果是透過validateForm()來執行此函式，就不會傳入id
  if (id) {
    return !document.getElementById(id).value.trim(``) ? false : true;
  } else {
    return [
      ticketTitle,
      ticketImg,
      ticketLocation,
      ticketDescription,
    ].every(dom => dom.value.trim(``));
  }
}

// 新增資料到Data陣列
function createItem() {
  const item = {
    id: data.length,
    name: ticketTitle.value,
    imgUrl: ticketImg.value,
    area: ticketLocation.value,
    description: ticketDescription.value,
    group: ticketNum.value,
    price: ticketPrice.value || 0, //如果沒輸入，就預設是0
    rate: ticketRate.value,
  };
  data.push(item);
  createHTMLContent(data);
}

// 組內容的HTML字串
function createHTMLContent(dataList) {
  let template = item => {
    return `  <li class="ticketCard">
    <div class="ticketCard-img">
      <a href="#">
        <img src="${item.imgUrl}" alt="">
      </a>
      <div class="ticketCard-region">${item.area}</div>
      <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
      <div>
        <h3>
          <a href="#" class="ticketCard-name">${item.name}</a>
        </h3>
        <p class="ticketCard-description">
        ${item.description}
        </p>
      </div>
      <div class="ticketCard-info">
        <p class="ticketCard-num">
          <span><i class="fas fa-exclamation-circle"></i></span>
          剩下最後 <span id="ticketCard-num"> ${item.group}</span> 組
        </p>
        <p class="ticketCard-price">
          TWD <span id="ticketCard-price">${item.price}</span>
        </p>
      </div>
    </div>
  </li>`;
  };

  const HTMLstr = dataList.reduce((acc, curr) => {
    let content = template(curr);
    return (acc += content);
  }, ``);

  updateDateLength(dataList);
  render(HTMLstr);
}

// 渲染所有內容
function render(allContent) {
  ticketCardArea.innerHTML = allContent;
  clearInput();
}

// 更新顯示資料的數目
function updateDateLength(data) {
  searchResultText.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
}

// 按地區搜尋來過濾顯示資料
function filterResult() {
  const filterList =
    regionSearch.value === ``
      ? data
      : data.filter(item => item.area === regionSearch.value);
  createHTMLContent(filterList);
}

// 表單送出後，清除之前在input所有的輸入
function clearInput() {
  inputDOMlist.forEach(dom => (dom.value = ``));
}

// 一載入畫面後立即顯示預設資料
createHTMLContent(data);
