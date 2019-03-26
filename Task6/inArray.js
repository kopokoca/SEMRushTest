function inArray(num, arr) {
  return arr.includes(num);
}

function inArr(num) {
  return this.includes(num);
}

Array.prototype.inArray = inArr;

console.log([1,2,3,4,5].inArray(5));
console.log([1,2,3,4].inArray(5));
console.log(inArray(1,[1,2,3,4]));
console.log(inArray(1,[2,3,4]));