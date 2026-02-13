// =====================
// LineCal v1.2 Script
// =====================

const calendarContainer = document.getElementById('calendarContainer');
const monthLabel = document.getElementById('monthLabel');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addEventBtn = document.getElementById('addEventBtn');
const inputPanel = document.getElementById('inputPanel');
const eventInput = document.getElementById('eventInput');
const saveEventBtn = document.getElementById('saveEventBtn');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = today.getDate();

// Load events from localStorage
let lineCalData = JSON.parse(localStorage.getItem('lineCalData') || '{}');

// =====================
// Month Names
// =====================
const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// =====================
// Render Calendar
// =====================
function renderCalendar(month, year){
  calendarContainer.innerHTML = '';
  monthLabel.textContent = `${monthNames[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for(let day=1; day<=daysInMonth; day++){
    const dayRow = document.createElement('div');
    dayRow.classList.add('day-row');
    if(day === selectedDay) dayRow.classList.add('selected');

    const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    if(isToday) dayRow.classList.add('today');

    // Day header with date first
    const dayObj = new Date(year, month, day);
    const dayName = dayObj.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
    const dayLeft = document.createElement('div');
    dayLeft.classList.add('day-left');
    dayLeft.textContent = `${day} ${dayName}`; // 12 Mon
    dayRow.appendChild(dayLeft);

    // Events container
    const dayEvents = document.createElement('div');
    dayEvents.classList.add('day-events');

    const events = lineCalData[`${year}-${month+1}-${day}`] || [];
    events.forEach((ev, idx) => {
      const evDiv = document.createElement('div');
      evDiv.classList.add('event-item');
      evDiv.textContent = ev;

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.classList.add('delete-btn');
      delBtn.textContent = '✕';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        if(confirm('Delete this event?')){
          events.splice(idx,1);
          if(events.length === 0){
            delete lineCalData[`${year}-${month+1}-${day}`];
          } else {
            lineCalData[`${year}-${month+1}-${day}`] = events;
          }
          localStorage.setItem('lineCalData', JSON.stringify(lineCalData));
          renderCalendar(month, year);
        }
      };
      evDiv.appendChild(delBtn);
      dayEvents.appendChild(evDiv);
    });

    dayRow.appendChild(dayEvents);

    // Day selection
    dayRow.onclick = () => {
      selectedDay = day;
      renderCalendar(currentMonth, currentYear);
    };

    calendarContainer.appendChild(dayRow);
  }

  // Scroll selected day into view (desktop/journal feel)
  const selectedRow = document.querySelector('.day-row.selected');
  if(selectedRow){
    selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// =====================
// Month Navigation
// =====================
prevMonthBtn.onclick = () => {
  currentMonth--;
  if(currentMonth < 0){
    currentMonth = 11;
    currentYear--;
  }
  selectedDay = 1;
  renderCalendar(currentMonth, currentYear);
};

nextMonthBtn.onclick = () => {
  currentMonth++;
  if(currentMonth > 11){
    currentMonth = 0;
    currentYear++;
  }
  selectedDay = 1;
  renderCalendar(currentMonth, currentYear);
};

// =====================
// Add Event Panel
// =====================
addEventBtn.onclick = () => {
  inputPanel.classList.remove('hidden');
  eventInput.focus();
};

saveEventBtn.onclick = () => {
  let val = eventInput.value.trim();
  if(val === ''){
    inputPanel.classList.add('hidden');
    return;
  }

  // Prefix override: "12 Meeting"
  let dayOverride = selectedDay;
  const match = val.match(/^(\d{1,2})\s+(.*)$/);
  if(match){
    const possibleDay = parseInt(match[1],10);
    if(possibleDay >=1 && possibleDay <= new Date(currentYear, currentMonth+1,0).getDate()){
      dayOverride = possibleDay;
      val = match[2];
    }
  }

  const key = `${currentYear}-${currentMonth+1}-${dayOverride}`;
  if(!lineCalData[key]) lineCalData[key] = [];
  lineCalData[key].push(val);

  localStorage.setItem('lineCalData', JSON.stringify(lineCalData));
  eventInput.value = '';
  inputPanel.classList.add('hidden');

  renderCalendar(currentMonth, currentYear);
};

// Close input panel on outside click
document.addEventListener('click', (e) => {
  if(!inputPanel.contains(e.target) && e.target !== addEventBtn){
    inputPanel.classList.add('hidden');
  }
});

// Initialize calendar
renderCalendar(currentMonth, currentYear);
