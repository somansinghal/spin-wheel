const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const optionInput = document.getElementById("option-input");
const setOptionsBtn = document.getElementById("set-options");
const themeSelector = document.getElementById("theme-selector");

const spinSound = document.getElementById("spin-sound");
const winSound = document.getElementById("win-sound");

let chart;
let options = ["A", "B", "C", "D"];

function createWheel(data) {
  if (chart) chart.destroy();

  chart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: data,
      datasets: [{
        data: Array(data.length).fill(1),
        backgroundColor: data.map(
          () => `hsl(${Math.random() * 360},80%,60%)`
        )
      }]
    },
    options: {
      rotation: 0,
      animation: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: "#fff",
          font: { size: 14 }
        }
      }
    }
  });
}

createWheel(options);

themeSelector.addEventListener("change", () => {
  document.body.className = themeSelector.value;
});

setOptionsBtn.addEventListener("click", () => {
  const values = optionInput.value
    .split(",")
    .map(v => v.trim())
    .filter(v => v);

  if (values.length < 2) {
    alert("Enter at least 2 options!");
    return;
  }

  options = values;
  createWheel(options);
  finalValue.innerHTML = "🎯 Wheel Ready";
});
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  spinSound.currentTime = 0;
  spinSound.play();
  finalValue.innerHTML = "Spinning...";

  const totalRotation = 360 * 6 + Math.random() * 360;
  let start = null;
  const duration = 4000;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    const eased = easeOutCubic(Math.min(progress, 1));

    chart.options.rotation = eased * totalRotation;
    chart.update();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinBtn.disabled = false;

      const index = Math.floor(
        ((360 - (totalRotation % 360)) % 360) /
        (360 / options.length)
      );

      finalValue.innerHTML = `🎉 Result: <strong>${options[index]}</strong>`;
      winSound.play();
    }
  }

  requestAnimationFrame(animate);
});
