const container = document.getElementById('visualizer-container');
const algoSelect = document.getElementById('algoSelect');
const speedRange = document.getElementById('speedRange');
const randomBtn = document.getElementById('randomBtn');
const startBtn = document.getElementById('startBtn');
const timeLabel = document.getElementById('timeLabel');

let array = [];
const arraySize = 100;
let isRunning = false;
let shouldStop = false;
let delay = 50;

// Renkler
const colors = {
    'Insertion': 'rgb(255, 100, 180)',
    'Selection': 'rgb(255, 220, 100)',
    'Merge': 'rgb(100, 150, 255)',
    'Quick': 'rgb(200, 120, 255)',
    'Default': 'rgb(255, 255, 255)',
    'Highlight': 'rgb(0, 255, 128)' // Neon yeşil
};

let currentAlgoColor = colors['Insertion'];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    randomBtn.addEventListener('click', generateArray);
    startBtn.addEventListener('click', toggleSort);
    algoSelect.addEventListener('change', updateColor);
    speedRange.addEventListener('input', (e) => {
        delay = 101 - e.target.value; // Slider ters mantık: yüksek değer = düşük delay
    });

    updateColor();
    generateArray();
}

function updateColor() {
    const algo = algoSelect.value;
    currentAlgoColor = colors[algo];
    // Mevcut barların rengini güncelle (sadece çalışmıyorsa)
    if (!isRunning) {
        const bars = document.getElementsByClassName('bar');
        for (let bar of bars) {
            bar.style.backgroundColor = currentAlgoColor;
        }
    }
}

function generateArray() {
    if (isRunning) return;

    array = [];
    container.innerHTML = '';

    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 300) + 20; // 20-320
        array.push(value);

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${(value / 320) * 100}%`;
        bar.style.backgroundColor = currentAlgoColor;
        container.appendChild(bar);
    }

    timeLabel.innerText = "Time: 0 ms";
}

async function toggleSort() {
    if (isRunning) {
        // Durdurma mantığı (Refresh atarak durduruyoruz basitlik için)
        location.reload();
        return;
    }

    isRunning = true;
    randomBtn.disabled = true;
    algoSelect.disabled = true;
    startBtn.innerText = "Reset";
    startBtn.classList.replace('primary', 'secondary');

    const algo = algoSelect.value;
    const startTime = Date.now();

    try {
        switch (algo) {
            case 'Insertion': await insertionSort(); break;
            case 'Selection': await selectionSort(); break;
            case 'Merge': await mergeSort(0, array.length - 1); break;
            case 'Quick': await quickSort(0, array.length - 1); break;
        }
    } catch (e) {
        console.log(e);
    }

    const endTime = Date.now();
    timeLabel.innerText = `Time: ${endTime - startTime} ms`;

    // Bitti
    isRunning = false;
    randomBtn.disabled = false;
    algoSelect.disabled = false;
    startBtn.innerText = "Start";
    startBtn.classList.replace('secondary', 'primary');

    const bars = document.getElementsByClassName('bar');
    for (let bar of bars) bar.style.backgroundColor = colors['Highlight'];
}

async function updateBar(index, color) {
    const bars = document.getElementsByClassName('bar');
    if (bars[index]) {
        bars[index].style.height = `${(array[index] / 320) * 100}%`;
        bars[index].style.backgroundColor = color ? color : currentAlgoColor;
    }
}

async function swap(i, j) {
    await sleep(delay);
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    updateBar(i, colors['Highlight']);
    updateBar(j, colors['Highlight']);

    await sleep(delay);

    updateBar(i, currentAlgoColor);
    updateBar(j, currentAlgoColor);
}

// --- ALGORİTMALAR ---

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        await updateBar(i, colors['Highlight']);

        while (j >= 0 && array[j] > key) {
            await sleep(delay);
            array[j + 1] = array[j];
            updateBar(j + 1, colors['Highlight']); // Taşıma efekti
            await sleep(delay / 2);
            updateBar(j + 1, currentAlgoColor); // Eski haline dön
            j--;
        }
        array[j + 1] = key;
        updateBar(j + 1, currentAlgoColor);
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let min = i;
        await updateBar(i, colors['Highlight']);

        for (let j = i + 1; j < array.length; j++) {
            await updateBar(j, colors['Highlight']); // Arama rengi
            if (array[j] < array[min]) {
                if (min !== i) updateBar(min, currentAlgoColor);
                min = j;
                await updateBar(min, colors['Highlight']);
            } else {
                await sleep(delay / 4);
                updateBar(j, currentAlgoColor);
            }
        }

        if (min !== i) {
            await swap(i, min);
        } else {
            updateBar(i, currentAlgoColor);
        }
    }
}

async function mergeSort(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        await sleep(delay);
        // Karşılaştırma görselleştirmesi (k pozisyonu)
        updateBar(k, colors['Highlight']);

        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        await updateBar(k, colors['Highlight']); // Değeri güncelle ve boya
        await sleep(delay / 2);
        updateBar(k, currentAlgoColor); // Normale dön
        k++;
    }

    while (i < n1) {
        await sleep(delay);
        array[k] = L[i];
        await updateBar(k, colors['Highlight']);
        await sleep(delay / 2);
        updateBar(k, currentAlgoColor);
        i++;
        k++;
    }

    while (j < n2) {
        await sleep(delay);
        array[k] = R[j];
        await updateBar(k, colors['Highlight']);
        await sleep(delay / 2);
        updateBar(k, currentAlgoColor);
        j++;
        k++;
    }
}

async function quickSort(l, r) {
    if (l < r) {
        let pi = await partition(l, r);
        await quickSort(l, pi - 1);
        await quickSort(pi + 1, r);
    }
}

async function partition(l, r) {
    let pivot = array[r];
    await updateBar(r, colors['Highlight']); // Pivot
    let i = (l - 1);

    for (let j = l; j < r; j++) {
        await updateBar(j, colors['Highlight']); // Current
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        } else {
            await sleep(delay / 2);
            updateBar(j, currentAlgoColor);
        }
    }
    await swap(i + 1, r);
    return i + 1;
}

// --- View Switcher & Performance Logic ---

// Elements
const viewVisualizer = document.getElementById('viewVisualizer');
const viewPerformance = document.getElementById('viewPerformance');
const btnVisualizer = document.getElementById('btnVisualizer');
const btnPerformance = document.getElementById('btnPerformance');

const perfSizesInput = document.getElementById('perfSizes');
const perfTrialsInput = document.getElementById('perfTrials');
const runPerfBtn = document.getElementById('runPerfBtn');
const resultsTableWrapper = document.getElementById('resultsTableWrapper');

// Event Listeners for Switcher
btnVisualizer.addEventListener('click', () => switchView('visualizer'));
btnPerformance.addEventListener('click', () => switchView('performance'));

function switchView(mode) {
    if (mode === 'visualizer') {
        viewVisualizer.style.display = 'block';
        viewPerformance.style.display = 'none';
        btnVisualizer.classList.add('active');
        btnPerformance.classList.remove('active');
    } else {
        viewVisualizer.style.display = 'none';
        viewPerformance.style.display = 'block';
        btnVisualizer.classList.remove('active');
        btnPerformance.classList.add('active');
    }
}

// Performance Test Event
runPerfBtn.addEventListener('click', runPerformanceTests);

// --- SYNCHRONOUS ALGORITHMS (For Performance Testing) ---
// These run without 'await' and without GUI updates

function getInsertionSortTime(arr) {
    const start = performance.now();
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return performance.now() - start;
}

function getSelectionSortTime(arr) {
    const start = performance.now();
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) min = j;
        }
        if (min !== i) {
            let temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
        }
    }
    return performance.now() - start;
}

// Wrapper to time Merge Sort
function getMergeSortTime(arr) {
    const start = performance.now();
    mergeSortSync(arr, 0, arr.length - 1);
    return performance.now() - start;
}

function mergeSortSync(arr, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSortSync(arr, l, m);
    mergeSortSync(arr, m + 1, r);
    mergeSync(arr, l, m, r);
}

function mergeSync(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

// Wrapper to time Quick Sort
function getQuickSortTime(arr) {
    const start = performance.now();
    quickSortSync(arr, 0, arr.length - 1);
    return performance.now() - start;
}

function quickSortSync(arr, l, r) {
    if (l < r) {
        let pi = partitionSync(arr, l, r);
        quickSortSync(arr, l, pi - 1);
        quickSortSync(arr, pi + 1, r);
    }
}

function partitionSync(arr, l, r) {
    let pivot = arr[r];
    let i = (l - 1);
    for (let j = l; j < r; j++) {
        if (arr[j] < pivot) {
            i++;
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[r];
    arr[r] = temp;
    return i + 1;
}

// --- BENCHMARKING ENGINE ---

async function runPerformanceTests() {
    runPerfBtn.disabled = true;
    runPerfBtn.innerText = "Running...";
    resultsTableWrapper.innerHTML = "<p>Running tests... Please wait.</p>";

    // Parse Inputs
    let sizes = perfSizesInput.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    let trials = parseInt(perfTrialsInput.value);
    
    if (sizes.length === 0 || isNaN(trials) || trials < 1) {
        alert("Please check your inputs.");
        runPerfBtn.disabled = false;
        runPerfBtn.innerText = "Run Performance Tests";
        return;
    }

    // Allow UI to update before freezing
    await sleep(100);

    const algorithms = ['Insertion', 'Selection', 'Merge', 'Quick'];
    let results = {}; // { 'Algorithm': { size1: avgTime, size2: avgTime } }

    algorithms.forEach(alg => results[alg] = {});

    // Run Tests
    for (let n of sizes) {
        for (let algName of algorithms) {
            let totalTime = 0;
            
            for (let t = 0; t < trials; t++) {
                // Generate random array
                let arr = Array.from({length: n}, () => Math.floor(Math.random() * 10000));
                
                // Run Sort
                if (algName === 'Insertion') totalTime += getInsertionSortTime(arr);
                else if (algName === 'Selection') totalTime += getSelectionSortTime(arr);
                else if (algName === 'Merge') totalTime += getMergeSortTime(arr);
                else if (algName === 'Quick') totalTime += getQuickSortTime(arr);
            }
            
            results[algName][n] = (totalTime / trials).toFixed(3);
        }
    }

    renderResults(sizes, results);
    
    runPerfBtn.disabled = false;
    runPerfBtn.innerText = "Run Performance Tests";
}

function renderResults(sizes, results) {
    let html = `<table>
        <thead>
            <tr>
                <th>Algorithm</th>
                ${sizes.map(s => `<th>Size ${s}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
    `;

    for (let alg in results) {
        html += `<tr><td><strong>${alg}</strong></td>`;
        sizes.forEach(size => {
            html += `<td>${results[alg][size]} ms</td>`;
        });
        html += `</tr>`;
    }

    html += `</tbody></table>`;
    resultsTableWrapper.innerHTML = html;
}

init();
