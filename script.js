'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1Time = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2Time = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accountsTime = [account1Time, account2Time];

///////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Jonamae Lazana',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // remove negative sign -
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

const calcDisplayBalance = function (acc) {
  acc.balace = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balace.toFixed(2)} €`;
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reveicerAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reveicerAcc &&
    currentAccount.balace >= amount &&
    reveicerAcc?.username !== currentAccount.username
  ) {
    // Doing the trasfer
    currentAccount.movements.push(-amount);
    reveicerAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// Delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const accInputUser = inputCloseUsername.value;
  const accInputPin = Number(inputClosePin.value);
  if (
    currentAccount.username === accInputUser &&
    currentAccount.pin === accInputPin
  ) {
    // indexOf(23)
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// arrays are object too

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE METHOD in array return new array only the extracted part
// console.log(arr.slice(2)); // ['c', 'd', 'e']
// console.log(arr.slice(2, 4)); // ['c', 'd']
// console.log(arr.slice(-2)); // get last element
// console.log(arr.slice(1, -2));
// // create a shallow copy of the array
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE METHOD mutates the array
// console.log(arr.splice(2)); //delete the a and b
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE mutate original array
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT does not mutate
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log(...arr, ...arr2);

// // JOIN
// console.log(letters.join('-'));
// // SHIFT UNSHEFT POP PUSH INDEXOF INCLUDES

//======================THE NEW METHOD=========================
// const arr = [23, 11, 64];

// // AT METHOD
// console.log(arr[0]);
// console.log(arr.at(0));
// console.log('jonas'.at(0)); // j

// // getting last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

//=====================ARRAYS: FOREACH=========================
// // forEach loop don't work break
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('------------ FOREACH -----------');
// movements.forEach(function (move, i, arr) {
//   if (move > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${move}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(move)}`);
//   }
// });
// // 0: function(200)
// // 1: function(450)
// // 2: function(400)
// //...
//=================FOREACH WITH MAPS & SETS===================
// // MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// // SET
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _value, map) {
//   console.log(`${_value}: ${value}`);
// });
//======================MAP METHOD==========================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// const movementsArrowUSD = movements.map(mov => mov * eurToUsd);

// // console.log(movements);
// // console.log(movementsUSD);

// const movementsDescriptions = movements.map((mov, i) => {
//   return `Movement ${i + 1}: You ${
//     mov > 0 ? 'deposited' : 'withdrew'
//   } ${Math.abs(mov)}`;
// });
// // console.log(movementsDescriptions);
//===================FILTER METHOD========================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const withdrawals = movements.filter(move => move < 0);
// console.log(withdrawals);
//=================REDUCE METHOD=========================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // accumulator snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);
// console.log(movements);

// let balance2 = 0
// for(const mov of movements) {
//   balance2 += mov
// }
// console.log(balance2);

// // get the Maximum value form any array
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);
//======================CHAINING METHOD==========================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);
//=======================FIND METHOD===========================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // only return the first one value that is true / not an array
// const firstWitdrawal = movements.find(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(firstWitdrawal);

// console.log(accounts);

// // get spicific object from array base on the name
// // find exactly one element
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let accountLoop;
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     accountLoop = acc;
//     break; //Stop the loop once found
//   }
// }
// console.log(accountLoop);
//===============FINDLAST & FINDLASTINDEX METHODS====================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// const lastWithdrawal = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawal); // -130

// //Yoy latest large movement was x movements ago
// const latestLargeMovementIndex = movements.findLastIndex(
//   mov => Math.abs(mov) > 2000
// );
// console.log(latestLargeMovementIndex);
// console.log(
//   `Your latest large movement was ${
//     movements.length - latestLargeMovementIndex
//   } movements ago`
// );
//=======================SOME & EVERY=============================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// // check only for equality
// console.log(movements.includes(-130));

// // check for a condition
// // SOME: CONDITION
// console.log(movements.some(mov => mov === -130));

// //if any value is > than 0 return true
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
//====================FLAT & FLATMAP METHOD===========================
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

// // remove nested arr into one array
// console.log(arr.flat());

// const arrDeep = [
//   [[1, 2], 3],
//   [4, [5, 6]],
//   [7, 8],
// ];

// // second level
// console.log(arrDeep.flat(2));

// //add movements
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// //flatMap method combind map and flat method
// const overalBalance1 = accounts
//   .flatMap(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance1);
//===========================CHALLEGE===============================

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];

// //1
// const huskyWeight = breeds.find(bre => bre.breed === 'Husky').averageWeight;
// console.log(huskyWeight);

// //2
// const dogBothActivities = breeds.find(
//   bre => bre.activities.includes('running') && bre.activities.includes('fetch')
// ).breed;
// console.log(dogBothActivities);

// //3
// const allActivities = breeds.map(bre => bre.activities).flat();
// console.log(allActivities);

// //4
// const uniqueActivities = [...new Set(breeds.flatMap(bre => bre.activities))];
// console.log(uniqueActivities);

// //5
// const [...swimmingAdjacent] = new Set(
//   breeds
//     .filter(bre => bre.activities.includes('swimming'))
//     .flatMap(bre => bre.activities)
//     .filter(activity => activity !== 'swimming')
// );
// console.log(swimmingAdjacent);

// //6
// const allAverageWeight = breeds.every(bre => bre.averageWeight >= 10);
// console.log(allAverageWeight);

// //7
// const activeBreed = breeds.some(bre => bre.activities.length >= 3);
// console.log(activeBreed);

// //bonus
// const heaviestBreed = [];
// for (const bre of breeds) {
//   heaviestBreed.push(bre.averageWeight);
// }
// console.log(
//   breeds.find(bre => bre.averageWeight === Math.max(...heaviestBreed)).breed
// );

// const fetchWeights = breeds
//   .filter(bre => bre.activities.includes('fetch'))
//   .map(bre => bre.averageWeight);
// const heaviestFetchBreed = Math.max(...fetchWeights);
// console.log(heaviestFetchBreed);
//=====================SORTING ARRAYS=========================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // String
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// // Mutates the original array
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);

// // return < 0 A before B (keep order)
// // return > 0 B before A (Switch order)

// // Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// movements.sort((a, b) => a - b);
// console.log(movements);

// // Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// movements.sort((a, b) => b - a);
// console.log(movements);
//=====================ARRAY GROUPING=======================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// const groupedMovements = Object.groupBy(movements, movement =>
//   movement > 0 ? 'deposits' : 'widthdrawals'
// );
// console.log(groupedMovements);

// const groupedByActivity = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;
//   if (movementCount >= 8) return 'very active';
//   if (movementCount >= 4) return 'active';
//   if (movementCount >= 1) return 'moderate';
//   return 'inactive';
// });
// console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, account => account.type);
// console.log(groupedAccounts);

// const groupedAccounts1 = Object.groupBy(accounts, ({ type }) => type);
// console.log(groupedAccounts1);
//==================WAYS OF CREATING & FILLING ARRAYS==================
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // create an empty array with 7 avilable space
// // Empty arrays + fill method
// const x = new Array(7);
// console.log(x);

// x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 4, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );

//   console.log(movementsUI);

//   // const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   // console.log(movementsUI2);
// });
//====================NON-DESTRUCTIVE ALTERNATIVES======================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// // toReversed method
// const reversedMov = movements.toReversed();
// console.log(reversedMov);

// // toSorted (sort), toSplice (splice)

// // movements[1] = 2000;
// // with method
// const newMovements = movements.with(1, 2000);
// console.log(newMovements);
// console.log(movements);
//===========================================================
// // Array Methods Practice

// //1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum);

// //2.
// /* Count how many deposits there have been in the bank with at least 1,000 */
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numDeposits1000);

// // Prefixed ++ operator
// let a = 10;
// console.log(++a);
// console.log(a);

// //3.
// /*Create an object which ontains the sum of the deposits & withdrawals.*/
// const { deposit, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposit += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposit: 0, withdrawals: 0 }
//   );

// console.log(deposit, withdrawals);

// //4.
// //this is a nice title => This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'the', 'but', 'and', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));
//===========================LAST CHALLENGER=============================
/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:

3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
//   { weight: 18, curFood: 244, owners: ['Joe'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //1.
// dogs.forEach(function (dog) {
//   dog.recFood = Math.floor(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);

// //2.
// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// const sarahsDogStats =
//   sarahDog.curFood > sarahDog.recFood ? 'Eating too much' : 'Eating too little';
// console.log(sarahsDogStats);

// //3.
// const ownersTooMuch = [];
// const ownersTooLittle = [];
// for (const dog of dogs) {
//   if (dog.curFood > dog.recFood) {
//     ownersTooMuch.push(...dog.owners);
//   } else {
//     ownersTooLittle.push(...dog.owners);
//   }
// }
// console.log(ownersTooMuch);
// console.log(ownersTooLittle);

// //4.
// const displayStr = function (ownerTooMuch, ownerTooLittle) {
//   const firstStr = `"${ownerTooMuch
//     .join(' ')
//     .replaceAll(' ', ' and ')
//     .concat("'s dogs eat too much!")}"`;
//   const secondStr = firstStr.concat(
//     ` and "${ownerTooLittle.join(' ').replaceAll(' ', ' and ')}"`
//   );
//   console.log(secondStr);
// };
// displayStr(ownersTooMuch, ownersTooLittle);

// //5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// //6.
// console.log(
//   dogs.every(
//     dog => dog.curFood >= dog.recFood * 0.9 && dog.curFood <= dog.recFood * 1.1
//   )
// );

// //7.
// const checkEatingOkay = dog =>
//   dog.curFood >= dog.recFood * 0.9 && dog.curFood <= dog.recFood * 1.1;

// const eatingOkay = dogs.filter(dog => {
//   return checkEatingOkay(dog);
// });
// console.log(eatingOkay);

// //8.
// const groupDogs = Object.groupBy(dogs, dog => {
//   if (checkEatingOkay(dog)) return 'exact';
//   if (dog.curFood > dog.recFood) return 'too-much';
//   if (dog.curFood < dog.recFood) return 'too-little';
// });
// console.log(groupDogs);

// //9. //Group the dogs by the number of owners they have
// const ownerGroup = Object.groupBy(dogs, dog => `${dog.owners.length}-owners`);
// console.log(ownerGroup);

// //10.
// const sortedRecFood = dogs.toSorted((a, b) => b.recFood - a.recFood);
// console.log(sortedRecFood);
//=============================NUMBERS=============================
// console.log(23 === 23.0); // true

// // Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// // Binary base 2 - 0 1
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3); // flase

// // Converting String to a number
// console.log(Number('23'));
// console.log(+'23'); // type coercion

// // Parsing Number form String
// console.log(Number.parseInt('30px', 10)); // should it start in number
// console.log(Number.parseInt('e23', 10)); // NaN

// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('2.5rem'));

// // console.log(Number.parseFloat('2.5rem'));

// // Boolean
// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// // Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));
//=====================MATH & ROUNDING==========================
// get the square root
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
// cubic
console.log(8 ** (1 / 2));

// get the max value
console.log(Math.max(2, 18, 23, 11, 2));
console.log(Math.max(2, 18, '23', 11, 2));
console.log(Math.max(2, 18, '23p', 11, 2)); // NaN

// get the min value
console.log(Math.max(2, 18, 23, 11, 2));

// calculate area of a cirlce
console.log(Math.PI * Number.parseFloat('10px') ** 2);

// generate random number
console.log(Math.trunc(Math.random() * 6) + 1);

// random number generator dynamically
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
// 0...1 -> 0...(max - min) -> min....max
console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.trunc(23.3)); //23

console.log(Math.round(23.3)); //23
console.log(Math.round(23.9)); //24

// round up
console.log(Math.ceil(23.3)); // 24
console.log(Math.ceil(23.9)); //24

// round down
console.log(Math.floor(23.3)); // 23
console.log(Math.floor('23.9')); // 23

console.log(Math.trunc(-23.3)); // -23
console.log(Math.floor(-23.3)); // -24

// Rounding decimals
// toFixed always return string
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log(+(2.345).toFixed(2));
