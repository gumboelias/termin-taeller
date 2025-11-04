const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

const datetimeInput = document.getElementById('datetimeInput');

// selectedDateTime stores the target time in milliseconds since epoch
// It starts as null until the user picks a date/time (or you can set a default)
let selectedDateTime = null;

// Helper: parse an <input type="datetime-local"> value into a local timestamp (ms)
// input format is typically "YYYY-MM-DDTHH:MM" (seconds optional). We construct
// a Date using numeric components so the result is in the browser's local timezone.
function parseDatetimeLocalToMs(value) {
  if (!value) return NaN;
  const [datePart, timePart] = value.split('T');
  if (!datePart) return NaN;
  const [y, mo, d] = datePart.split('-').map(Number);
  let h = 0, m = 0, s = 0;
  if (timePart) {
    const parts = timePart.split(':').map(Number);
    h = parts[0] || 0;
    m = parts[1] || 0;
    s = parts[2] || 0;
  }
  return new Date(y, mo - 1, d, h, m, s).getTime();
}

// Format helpers
const pad = (n) => String(n).padStart(2, '0');

function timer() {
  // If no target selected yet, don't update (or you can set a default target)
  if (!selectedDateTime) return;

  const currentDate = Date.now();
  const distance = selectedDateTime - currentDate;

  const days = Math.floor(distance / 1000 / 60 / 60 / 24);
  const hours = Math.floor((distance / 1000 / 60 / 60) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  // Update UI (pad smaller values for consistency)
  Days.innerHTML = days;
  Hours.innerHTML = pad(hours);
  Minutes.innerHTML = pad(minutes);
  Seconds.innerHTML = pad(seconds);

  if (distance < 0) {
    Days.innerHTML = "👶";
    Hours.innerHTML = "👶";
    Minutes.innerHTML = "👶";
    Seconds.innerHTML = "👶";
  }
}

// React when the user picks a date/time
if (datetimeInput) {
  // Use 'change' so it's set when the user finishes selecting a date/time
  datetimeInput.addEventListener('change', () => {
    const value = datetimeInput.value;
    const ms = parseDatetimeLocalToMs(value);
    if (isNaN(ms)) {
      console.warn('Invalid datetime input:', value);
      selectedDateTime = null;
      return;
    }
    selectedDateTime = ms;
    // Update immediately so the UI doesn't wait up to 1s
    timer();
  });
}

// Start the interval (timer will only run once a date is selected)
setInterval(timer, 1000);

// Optionally, if you want an initial default target, set selectedDateTime here:
// selectedDateTime = new Date('November 1 2025 00:00:00').getTime();
// timer();