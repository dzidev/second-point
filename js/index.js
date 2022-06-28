import "./crypto.js";
import storage from "./storage.js";
import { decrypt } from "./crypto.js";

const refs = {
  main: document.querySelector("#main"),
  login: document.querySelector("#login"),
  form: document.querySelector("#login > form"),
  logout: document.querySelector("#logout"),
  date: document.querySelector(".data"),
  dutyName: document.querySelector(".person-duty-name"),
  dutyPhone: document.querySelector(".phone"),
  update: document.querySelector(".update"),
};

// console.log(refs);

const STORAGE_KEY = "second-point";
const DEFAULT_STORE =
  "F7Yp7TuHTHDNmmBeBOdloO0W8B3jz0SVHCtFro+6F5u35lVXV9czQQ5bWJJFeER3qupAuE1YY57xVK96bC+FXFxY5GGzCtpYp6UnjuX66WDgGe64WD1LYgnGh3ilbfHXmY/JpxBlAck1tLdrHdt4dj6WOj+7fXUtnaUo3ppc1UZ3/a+ReR1wVAvxfVfZJxXXocjLQwDV6l5CV05j+3N3eFymDRfYPoH/pGlvys4qpXMSMJMFhZudge4OeW4mb9pJLkveEaoZCxJ6EZB0lYt+BauFqQ2efLjhdio3Ov2Nn4pgLY5IJSbgzC4=";

let store = storage.load(STORAGE_KEY);

refs.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = e.currentTarget.elements.pass.value;
  if (!store) {
    try {
      store = decrypt(DEFAULT_STORE, pass);
      storage.save(STORAGE_KEY, store);
    } catch (e) {
      console.error(e);
      alert("Try again;)");
    }
  }
  render();
});

refs.logout.addEventListener("click", (e) => {
  store = undefined;
  storage.remove(STORAGE_KEY);
  render();
});

const makeDate = ({ year, month, day, hour }) =>
  new Date(year, month - 1, day, hour);

const daysBetweenDates = (firstDate, lastDate) => {
  const diff = lastDate.getTime() - firstDate.getTime();
  if (diff <= 0) {
    return 0;
  }
  return Math.ceil(diff / (1000 * 3600 * 24)) - 1;
};

const pad = (number) => {
  if (number < 10) {
    return "0" + number;
  }
  return number;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDateString = (date) => {
  // const options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  // };
  // return date.toLocaleDateString("uk-UA", options);
  //return date.toLocaleDateString("en-US", options);

  return `${DAYS_OF_WEEK[date.getDay()]}, ${pad(date.getDate())}.${pad(
    date.getMonth() + 1
  )}.${date.getFullYear()}`;
};
//  ${pad(date.getHours())}:${pad(date.getMinutes())}

const render = () => {
  if (store) {
    refs.login.classList.add("is-hidden");
    refs.main.classList.remove("is-hidden");
    const now = new Date();
    refs.date.textContent = getDateString(now);
    const dutyStart = makeDate(store.dutyStart);
    const days = daysBetweenDates(dutyStart, now);
    const duty = store.duties[days % store.duties.length];
    refs.dutyName.textContent = duty.name;
    refs.dutyPhone.href = `tel:${duty.phone}`;
  } else {
    refs.main.classList.add("is-hidden");
    refs.login.classList.remove("is-hidden");
    refs.form.elements.pass.value = "";
  }
};

render();

// refs.update.addEventListener("click", render);

refs.update.addEventListener("click", (e) => {
  e.preventDefault();
  render();
});
