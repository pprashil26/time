const calendarContainer = document.getElementById('calendarContainer');
const monthLabel = document.getElementById('monthLabel');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const goTodayBtn = document.getElementById('goToday');
const addEventBtn = document.getElementById('addEventBtn');
const inputPanel = document.getElementById('inputPanel');
const eventInput = document.getElementById('eventInput');
const saveEventBtn = document.getElementById('saveEventBtn');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = today.getDate();

let lineCalData = JSON.parse(localStorage.getItem('lineCalData') || '{}');

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar(month, year){
  calendarContainer.innerHTML = '';
  monthLabel.textContent = `${monthNames[month]} ${year}`;
  const daysInMonth = new Date(year, month+1,0).getDate();

  for(let day=1; day<=daysInMonth; day++){
    const dayRow = document.createElement('div');
    dayRow.classList.add('day-row');
    if(day===selectedDay) dayRow.classList.add('selected');
    const isToday = (day===today.getDate() && month===today.getMonth() && year===today.getFullYear());
    if(isToday) dayRow.classList.add('today');

    const dayObj = new Date(year, month, day);
    const dayName = dayObj.toLocaleDateString('en-US',{weekday:'short'});

    const dayLeft = document.createElement('div');
    dayLeft.classList.add('day-left');

    const dayLabel = document.createElement('span');
    dayLabel.classList.add('day-label');
    dayLabel.textContent = `${day} ${dayName}`;
    dayLeft.appendChild(dayLabel);

    const events = lineCalData[`${year}-${month+1}-${day}`] || [];
    events.forEach((ev, idx)=>{
      const evSpan = document.createElement('span');
      evSpan.classList.add('event-item');
      evSpan.textContent = ev;

      const delBtn = document.createElement('button');
      delBtn.classList.add('delete-btn');
      delBtn.textContent = '×';
      delBtn.onclick = (e)=>{
        e.stopPropagation();
        if(confirm('Delete this event?')){
          events.splice(idx,1);
          if(events.length===0) delete lineCalData[`${year}-${month+1}-${day}`];
          else lineCalData[`${year}-${month+1}-${day}`]=events;
          localStorage.setItem('lineCalData', JSON.stringify(lineCalData));
          renderCalendar(month,year);
        }
      };
      evSpan.appendChild(delBtn);
      dayLeft.appendChild(evSpan);
    });

    dayRow.appendChild(dayLeft);
    dayRow.onclick = ()=>{ selectedDay=day; renderCalendar(currentMonth,currentYear); };
    calendarContainer.appendChild(dayRow);
  }

  const selectedRow = document.querySelector('.day-row.selected');
  if(selectedRow) selectedRow.scrollIntoView({behavior:'smooth', block:'center'});
}

prevMonthBtn.onclick = ()=>{
  currentMonth--;
  if(currentMonth<0){currentMonth=11; currentYear--;}
  selectedDay=1;
  renderCalendar(currentMonth,currentYear);
};

nextMonthBtn.onclick = ()=>{
  currentMonth++;
  if(currentMonth>11){currentMonth=0; currentYear++;}
  selectedDay=1;
  renderCalendar(currentMonth,currentYear);
};

/* NEW: Go to Today */
goTodayBtn.onclick = ()=>{
  const now = new Date();
  currentMonth = now.getMonth();
  currentYear = now.getFullYear();
  selectedDay = now.getDate();
  renderCalendar(currentMonth,currentYear);
};

addEventBtn.onclick = ()=>{
  inputPanel.classList.remove('hidden');
  eventInput.focus();
};

saveEventBtn.onclick = ()=>{
  let val = eventInput.value.trim();
  if(val===''){inputPanel.classList.add('hidden'); return;}

  let dayOverride = selectedDay;
  const match = val.match(/^(\d{1,2})\s+(.*)$/);
  if(match){
    const possibleDay = parseInt(match[1],10);
    if(possibleDay>=1 && possibleDay<=new Date(currentYear,currentMonth+1,0).getDate()){
      dayOverride = possibleDay;
      val = match[2];
    }
  }

  const key = `${currentYear}-${currentMonth+1}-${dayOverride}`;
  if(!lineCalData[key]) lineCalData[key]=[];
  lineCalData[key].push(val);

  localStorage.setItem('lineCalData', JSON.stringify(lineCalData));
  eventInput.value='';
  inputPanel.classList.add('hidden');
  renderCalendar(currentMonth,currentYear);
};

document.addEventListener('click',(e)=>{
  if(!inputPanel.contains(e.target) && e.target!==addEventBtn)
    inputPanel.classList.add('hidden');
});

renderCalendar(currentMonth,currentYear);
