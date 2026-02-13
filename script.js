// ====== DATA & STATE ======
let data = JSON.parse(localStorage.getItem("lineCalData")) || {};
let currentView = new Date();
let currentViewYear = currentView.getFullYear();
let currentViewMonth = currentView.getMonth(); // 0-indexed
let selectedDate = null;

// ====== ELEMENTS ======
const calendarContainer = document.getElementById("calendarContainer");
const monthLabel = document.getElementById("monthLabel");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const addEventBtn = document.getElementById("addEventBtn");
const inputPanel = document.getElementById("inputPanel");
const eventInput = document.getElementById("eventInput");
const saveEventBtn = document.getElementById("saveEventBtn");

// ====== UTILITY ======
function getMonthName(month) {
  return new Date(0, month).toLocaleString('default', { month: 'long' });
}

function formatDate(y, m, d){
  let mm = (m+1).toString().padStart(2,'0');
  let dd = d.toString().padStart(2,'0');
  return `${y}-${mm}-${dd}`;
}

function daysInMonth(year, month){
  return new Date(year, month+1,0).getDate();
}

// ====== RENDERING ======
function renderCalendar(){
  calendarContainer.innerHTML = "";
  monthLabel.textContent = `${getMonthName(currentViewMonth)} ${currentViewYear}`;

  const today = new Date();
  const totalDays = daysInMonth(currentViewYear,currentViewMonth);

  for(let d=1; d<=totalDays; d++){
    const dateStr = formatDate(currentViewYear,currentViewMonth,d);
    const day = new Date(currentViewYear,currentViewMonth,d).toLocaleDateString('default',{weekday:'short'});

    const dayRow = document.createElement('div');
    dayRow.classList.add('day-row');
    dayRow.dataset.date = dateStr;

    // Today highlight
    if(currentViewYear===today.getFullYear() && currentViewMonth===today.getMonth() && d===today.getDate()){
      dayRow.classList.add('today');
    }

    // Day Left
    const dayLeft = document.createElement('div');
    dayLeft.classList.add('day-left');
    dayLeft.innerHTML = `<span class="day-name">${day}</span> <span class="day-number">${d}</span>`;
    dayRow.appendChild(dayLeft);

    // Events container
    const dayEvents = document.createElement('div');
    dayEvents.classList.add('day-events');

    if(data[dateStr]){
      data[dateStr].forEach((evt,i)=>{
        const evtDiv = document.createElement('div');
        evtDiv.classList.add('event-item');
        evtDiv.innerHTML = `<span class="event-text">${evt}</span><button class="delete-btn">✕</button>`;
        evtDiv.querySelector('.delete-btn').addEventListener('click',()=>{
          if(confirm("Delete this event?")){
            data[dateStr].splice(i,1);
            if(data[dateStr].length===0) delete data[dateStr];
            localStorage.setItem("lineCalData",JSON.stringify(data));
            renderCalendar();
          }
        });
        dayEvents.appendChild(evtDiv);
      });
    }

    dayRow.appendChild(dayEvents);

    // Day selection
    dayRow.addEventListener('click',()=>{
      document.querySelectorAll('.day-row').forEach(el=>el.classList.remove('selected'));
      dayRow.classList.add('selected');
      selectedDate = dateStr;
    });

    calendarContainer.appendChild(dayRow);

    // Auto-select default day
    if(!selectedDate){
      const todayStr = formatDate(today.getFullYear(),today.getMonth(),today.getDate());
      if(currentViewMonth===today.getMonth() && currentViewYear===today.getFullYear()){
        selectedDate = todayStr;
        dayRow.classList.add('selected');
      } else if(d===1){
        selectedDate = dateStr;
        dayRow.classList.add('selected');
      }
    }
  }
}

// ====== NAVIGATION ======
prevMonthBtn.addEventListener('click',()=>{
  currentViewMonth--;
  if(currentViewMonth<0){
    currentViewMonth=11;
    currentViewYear--;
  }
  selectedDate=null;
  closeInputPanel();
  renderCalendar();
});

nextMonthBtn.addEventListener('click',()=>{
  currentViewMonth++;
  if(currentViewMonth>11){
    currentViewMonth=0;
    currentViewYear++;
  }
  selectedDate=null;
  closeInputPanel();
  renderCalendar();
});

// ====== INPUT PANEL ======
function openInputPanel(){
  inputPanel.classList.remove('hidden');
  eventInput.focus();
}

function closeInputPanel(){
  inputPanel.classList.add('hidden');
  eventInput.value="";
}

addEventBtn.addEventListener('click',openInputPanel);

// Save Event
saveEventBtn.addEventListener('click',saveEvent);
eventInput.addEventListener('keydown',(e)=>{
  if(e.key==="Enter") saveEvent();
});

function saveEvent(){
  let text = eventInput.value.trim();
  if(!text) return;

  let targetDate = selectedDate;

  // Check for prefix override
  const prefixMatch = text.match(/^(\d{1,2})\s(.+)/);
  if(prefixMatch){
    let dayNum = parseInt(prefixMatch[1],10);
    const totalDays = daysInMonth(currentViewYear,currentViewMonth);
    if(dayNum>=1 && dayNum<=totalDays){
      targetDate = formatDate(currentViewYear,currentViewMonth,dayNum);
      text = prefixMatch[2];
    }
  }

  if(!data[targetDate]) data[targetDate]=[];
  data[targetDate].push(text);
  localStorage.setItem("lineCalData",JSON.stringify(data));

  closeInputPanel();
  renderCalendar();
}

// Close panel if click outside
document.addEventListener('click', (e)=>{
  if(!inputPanel.contains(e.target) && e.target!==addEventBtn){
    closeInputPanel();
  }
});

// ====== INITIAL RENDER ======
renderCalendar();
