function insert(num) {
  document.form.textview.value = document.form.textview.value + num;
  console.log("I was fuckclicked!");
}

function result() {
  var res = document.form.textview.value;

  document.form.textview.value = eval(res);
}

function clean() {
  document.form.textview.value = "";
}

function back() {
  document.form.textview.value = document.form.textview.value.substring(
    0,
    document.form.textview.value.length - 1
  );
}

function calculate() {
  document.form.textview.value = "12";
}

function isDivisionByZero(denomenator) {
  return parseInt(denomenator) === 0;
}

function mult(a, b) {
  return (a * b) % 10;
}
