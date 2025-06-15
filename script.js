// 일부 샘플 차량 데이터
const carData = {
  stinger: { name: "기아 스팅어 3.3T", brand: "기아", weight: 1825, power: 370, zeroToHundred: 5.1 },
  g80: { name: "제네시스 G80 3.5T", brand: "제네시스", weight: 1995, power: 375, zeroToHundred: 5.7 },
  m3: { name: "BMW M3", brand: "BMW", weight: 1650, power: 480, zeroToHundred: 4.1 },
  s63: { name: "벤츠 S63 AMG", brand: "벤츠", weight: 2100, power: 612, zeroToHundred: 3.5 },
  mustang: { name: "포드 머스탱 GT", brand: "포드", weight: 1760, power: 450, zeroToHundred: 4.3 },
  challenger: { name: "닷지 챌린저 헬캣", brand: "닷지", weight: 2040, power: 717, zeroToHundred: 3.6 }
};

let selectedCar = null;
let simulationRunning = false;
let animationFrame = null;

const carGrid = document.getElementById('carGrid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const simulationArea = document.getElementById('simulationArea');
const resultArea = document.getElementById('resultArea');

const brandSelect = document.getElementById('brandSelect');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');

function renderCars() {
  const brand = brandSelect.value;
  const keyword = searchInput.value.toLowerCase();
  const keys = Object.keys(carData).filter(k => {
    const car = carData[k];
    return (!brand || car.brand === brand) && car.name.toLowerCase().includes(keyword);
  });

  carGrid.innerHTML = '';
  if (keys.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  keys.forEach(k => {
    const car = carData[k];
    const div = document.createElement('div');
    div.className = 'car-card';
    div.innerHTML = `<div class="car-info"><h3>${car.name}</h3><p>${car.power}마력 / ${car.weight}kg</p><p>제로백: ${car.zeroToHundred}초</p></div>`;
    div.onclick = () => {
      document.querySelectorAll('.car-card').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      selectedCar = k;
      updateInfo();
      startBtn.disabled = false;
    };
    carGrid.appendChild(div);
  });
}

function updateInfo() {
  const car = carData[selectedCar];
  document.getElementById('selectedCarName').textContent = car.name;
  document.getElementById('selectedCarWeight').textContent = `${car.weight}kg`;
  document.getElementById('selectedCarPower').textContent = `${car.power}마력`;
  document.getElementById('selectedCarPWR').textContent = (car.power / car.weight).toFixed(3);
  simulationArea.style.display = 'block';
}

function startSimulation() {
  if (!selectedCar || simulationRunning) return;

  const car = carData[selectedCar];
  const duration = car.zeroToHundred * 1000;
  let startTime = Date.now();
  const fill = document.getElementById('progressFill');
  const carIcon = document.getElementById('progressCar');
  const speedEl = document.getElementById('currentSpeed');
  const timeEl = document.getElementById('timerDisplay');

  simulationRunning = true;
  startBtn.disabled = true;
  resetBtn.disabled = true;

  function animate() {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    fill.style.width = `${progress * 100}%`;
    carIcon.style.left = `${progress * 100}%`;
    speedEl.textContent = Math.round(progress * 100);
    timeEl.textContent = `${(elapsed / 1000).toFixed(2)}초`;

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      finishSimulation();
    }
  }

  animate();
}

function finishSimulation() {
  simulationRunning = false;
  resetBtn.disabled = false;
  const car = carData[selectedCar];
  document.getElementById('resultCarName').textContent = car.name;
  document.getElementById('resultTime').textContent = `${car.zeroToHundred}초`;
  resultArea.style.display = 'block';
}

function resetSimulation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressCar').style.left = '0%';
  document.getElementById('currentSpeed').textContent = '0';
  document.getElementById('timerDisplay').textContent = '0.00초';
  resultArea.style.display = 'none';
  simulationRunning = false;
  resetBtn.disabled = false;
  startBtn.disabled = !selectedCar;
}

brandSelect.onchange = renderCars;
searchInput.oninput = renderCars;
startBtn.onclick = startSimulation;
resetBtn.onclick = resetSimulation;

document.addEventListener('DOMContentLoaded', () => {
  renderCars();
});
