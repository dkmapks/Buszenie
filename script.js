let cash = 1000;
let btcBalance = 0;
let storageUsed = 0;
let storageLimit = 50;

let inventory = {
  kokaina: 0,
  marihuana: 0,
  mefedron: 0,
  amfetamina: 0,
  pixy: 0
};

let warehouseLevels = [
  { name: "Darmowy", capacity: 50, cost: 0 },
  { name: "Poziom 2", capacity: 200, cost: 1000 },
  { name: "Poziom 3", capacity: 1000, cost: 5000 },
  { name: "Poziom 4", capacity: 5000, cost: 15000 },
  { name: "Poziom 5", capacity: 30000, cost: 30000 }
];
let currentWarehouse = 0;

let supplierOffers = [];
let clientOffers = [];
let vipClients = [];
let bulkClients = [];

let workers = [
  { name: "Kamil", available: true }, { name: "Monika", available: true }, { name: "Andrzej", available: true },
  { name: "Ola", available: true }, { name: "Tomek", available: true }, { name: "Wiktoria", available: true },
  { name: "Bartek", available: true }, { name: "Julia", available: true }, { name: "Paweł", available: true },
  { name: "Magda", available: true }
];
let activeDeliveries = [];

let travelCities = [
  { name: "Olsztyn", cost: 2500, bonus: 1, bought: false },
  { name: "Białystok", cost: 5000, bonus: 2, bought: false },
  { name: "Wrocław", cost: 10000, bonus: 4, bought: false },
  { name: "Gdańsk", cost: 20000, bonus: 5, bought: false },
  { name: "Warszawa", cost: 50000, bonus: 8, bought: false },
  { name: "Berlin", cost: 80000, bonus: 10, bought: false },
  { name: "Madryt", cost: 120000, bonus: 13, bought: false },
  { name: "Rzym", cost: 160000, bonus: 15, bought: false },
  { name: "Tokio", cost: 200000, bonus: 20, bought: false },
  { name: "Kolumbia", cost: 250000, bonus: 24, bought: false },
  { name: "Monako", cost: 400000, bonus: 30, bought: false }
];

let blackMarketOffers = [
  { drug: "kokaina", amount: 10, btcPrice: 0.01 },
  { drug: "marihuana", amount: 50, btcPrice: 0.005 },
  { drug: "mefedron", amount: 30, btcPrice: 0.015 },
  { drug: "amfetamina", amount: 20, btcPrice: 0.02 },
  { drug: "pixy", amount: 5, btcPrice: 0.002 }
];

let productionAvailable = false;
let productionMaterials = {
  kokaina: 0,
  marihuana: 0,
  mefedron: 0,
  amfetamina: 0
};

function updateUI() {
  document.getElementById("cash").innerText = cash;
  document.getElementById("btc").innerText = btcBalance.toFixed(3);
  document.getElementById("storageUsed").innerText = storageUsed;
  document.getElementById("storageLimit").innerText = storageLimit;

  let warehouseHTML = "";
  warehouseLevels.forEach((level, i) => {
    if (i > currentWarehouse && cash >= level.cost) {
      warehouseHTML += `<button onclick="upgradeWarehouse(${i})">${level.name} (${level.capacity}g) za ${level.cost} zł</button><br>`;
    }
  });
  document.getElementById("warehouseOptions").innerHTML = warehouseHTML;

  let invHTML = "";
  for (let drug in inventory) {
    invHTML += `<p>${drug}: ${inventory[drug]}g</p>`;
  }
  document.getElementById("inventory").innerHTML = invHTML;

  let supplierHTML = "";
  supplierOffers.forEach((offer, i) => {
    supplierHTML += `<p>${offer.amount}g ${offer.drug} po ${offer.price} zł/g <button onclick="acceptSupplier(${i})">Kup</button></p>`;
  });
  document.getElementById("supplierOffers").innerHTML = supplierHTML;

  let clientHTML = "";
  clientOffers.forEach((offer, i) => {
    clientHTML += `<p>Kup ${offer.amount}g ${offer.drug} za ${offer.price} zł/g <button onclick="acceptClient(${i})">Sprzedaj</button></p>`;
  });
  document.getElementById("clients").innerHTML = clientHTML;

  let bulkHTML = "";
  bulkClients.forEach((offer, i) => {
    bulkHTML += `<p>Hurtowy: ${offer.amount}g ${offer.drug} po ${offer.price} zł/g <button onclick="acceptBulk(${i})">Sprzedaj</button></p>`;
  });
  document.getElementById("bulkClients").innerHTML = bulkHTML;

  let blackMarketHTML = "";
  blackMarketOffers.forEach((offer, i) => {
    blackMarketHTML += `<p>${offer.amount}g ${offer.drug} za ${offer.btcPrice} BTC <button onclick="acceptBlackMarket(${i})">Kup</button></p>`;
  });
  document.getElementById("blackMarket").innerHTML = blackMarketHTML;

  if (storageLimit >= 30000) {
    productionAvailable = true;
    document.getElementById("productionPanel").style.display = 'block';
  }

  let workerHTML = "";
  workers.forEach((worker, i) => {
    workerHTML += `<p>${worker.name}: <button onclick="assignWorker(${i})">Zatrudnij</button> ${worker.available ? '(Dostępny)' : '(Zatrudniony)'}</p>`;
  });
  document.getElementById("workers").innerHTML = workerHTML;

  let productionHTML = "";
  if (productionAvailable) {
    productionHTML = `
      <h3>Produkcja narkotyków</h3>
      <p>Produkuj narkotyki w magazynie o pojemności 30 000g</p>
      <button onclick="produceDrug('kokaina')">Produkuj Kokainę</button>
      <button onclick="produceDrug('marihuana')">Produkuj Marihuanę</button>
      <button onclick="produceDrug('mefedron')">Produkuj Mefedron</button>
      <button onclick="produceDrug('amfetamina')">Produkuj Amfetaminę</button>
    `;
  }
  document.getElementById("productionPanel").innerHTML = productionHTML;
}

function upgradeWarehouse(level) {
  const warehouse = warehouseLevels[level];
  if (cash >= warehouse.cost) {
    cash -= warehouse.cost;
    storageLimit = warehouse.capacity;
    currentWarehouse = level;
    updateUI();
  }
}

function manualBuy() {
  const drug = document.getElementById("buyDrug").value;
  const amount = parseInt(document.getElementById("buyAmount").value);
  const price = parseInt(document.getElementById("buyPrice").value);

  if (cash >= price * amount) {
    cash -= price * amount;
    inventory[drug] += amount;
    storageUsed += amount;
    updateUI();
  }
}

function manualSell() {
  const drug = document.getElementById("sellDrug").value;
  const amount = parseInt(document.getElementById("sellAmount").value);
  const price = parseInt(document.getElementById("sellPrice").value);

  if (inventory[drug] >= amount) {
    cash += price * amount;
    inventory[drug] -= amount;
    storageUsed -= amount;
    updateUI();
  }
}

function acceptSupplier(index) {
  const offer = supplierOffers[index];
  if (cash >= offer.price * offer.amount) {
    cash -= offer.price * offer.amount;
    inventory[offer.drug] += offer.amount;
    storageUsed += offer.amount;
    supplierOffers.splice(index, 1);
    updateUI();
  }
}

function acceptClient(index) {
  const offer = clientOffers[index];
  if (inventory[offer.drug] >= offer.amount) {
    cash += offer.price * offer.amount;
    inventory[offer.drug] -= offer.amount;
    storageUsed -= offer.amount;
    clientOffers.splice(index, 1);
    updateUI();
  }
}

function acceptBulk(index) {
  const offer = bulkClients[index];
  if (inventory[offer.drug] >= offer.amount) {
    cash += offer.price * offer.amount;
    inventory[offer.drug] -= offer.amount;
    storageUsed -= offer.amount;
    bulkClients.splice(index, 1);
    updateUI();
  }
}

function acceptBlackMarket(index) {
  const offer = blackMarketOffers[index];
  if (btcBalance >= offer.btcPrice) {
    btcBalance -= offer.btcPrice;
    inventory[offer.drug] += offer.amount;
    updateUI();
  }
}

function assignWorker(index) {
  const worker = workers[index];
  if (worker.available) {
    worker.available = false;
    updateUI();
  }
}

function produceDrug(drug) {
  if (!productionAvailable) return;

  const amountProduced = 10; // Przykład: każda produkcja to 10g

  if (storageUsed + amountProduced <= storageLimit) {
    inventory[drug] += amountProduced;
    storageUsed += amountProduced;
    updateUI();
  }
}

function autoSave() {
  setInterval(() => {
    const gameData = {
      cash,
      btcBalance,
      storageUsed,
      storageLimit,
      inventory,
      currentWarehouse,
      supplierOffers,
      clientOffers,
      bulkClients,
      blackMarketOffers,
      workers
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }, 60000); // Zapis co 60 sekund
}

function loadGame() {
  const gameData = JSON.parse(localStorage.getItem("gameData"));
  if (gameData) {
    cash = gameData.cash;
    btcBalance = gameData.btcBalance;
    storageUsed = gameData.storageUsed;
    storageLimit = gameData.storageLimit;
    inventory = gameData.inventory;
    currentWarehouse = gameData.currentWarehouse;
    supplierOffers = gameData.supplierOffers;
    clientOffers = gameData.clientOffers;
    bulkClients = gameData.bulkClients;
    blackMarketOffers = gameData.blackMarketOffers;
    workers = gameData.workers;
    updateUI();
  }
}

autoSave();  // Uruchomienie autozapisu
