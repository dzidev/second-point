import "./crypto.js";
import storage from "./storage.js";
import { decrypt } from "./crypto.js";

const refs = {
  main: document.querySelector("#main"),
  login: document.querySelector("#login"),
  form: document.querySelector("#login > form"),
  logout: document.querySelector("#logout"),
  date: document.querySelector(".title__data"),
  dutyName: document.querySelector(".person-duty-title"),
  dutyPhone: document.querySelector(".person-phone"),
};

// console.log(refs);

const STORAGE_KEY = "second-point";
const DEFAULT_STORE =
  "F2ZFH5cXdwm+e7hqbjS/+GevKxavzyyQmh+ixRN/JS3b6K+dFYhf7Ku1VXkGOSjZcJKx+qgcNH5h5HpI1ck8mmMxrc3hBaGQvEE16we8Avf7tElc3hDoE9J/a4ysYr6GQZwOqdvY3AI+vCC5yFqGG8YoesEg14L8VXqvdly/fJEYOlTHzRBDUiz71CjOeOiwNckxUjCs2n3hc8NxNb2u9n83rE+rqzdfush92OSYSF0tKlTEg76m09ztU3NPjs4wLz+V3IVieKHvUeRUHCoYSMGOuCc6ziBYmOytvR4ea/HriESQ89krEf8=";

let store = storage.load(STORAGE_KEY);

refs.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = e.currentTarget.elements.pass.value;
  if (!store) {
    store = decrypt(DEFAULT_STORE, pass);
    storage.save(STORAGE_KEY, store);
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

const getDateString = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleDateString("uk-UA", options);
};

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
