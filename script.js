const calendarContainer = document.getElementById('calendarContainer');
const goTodayBtn = document.getElementById('goToday');
const addEventBtn = document.getElementById('addEventBtn');
const inputPanel = document.getElementById('inputPanel');
const eventInput = document.getElementById('eventInput');
const saveEventBtn = document.getElementById('saveEventBtn');

let today = new Date();
let selectedDate = new Date(today);
let lineCalData = JSON.parse(localStorage.getItem('lineCalData') || '{}');

// Helper to format YYYY-M-D key
function formatKey(date){
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

// Render continuous days around anchor date
function renderDays(anchorDate, daysBefore=30, daysAfter=366){
    calendarContainer.innerHTML = '';

    const startDate = new Date(anchorDate);
    startDate.setDate(startDate.getDate() - daysBefore);

    const totalDays = daysBefore + daysAfter + 1;

    for(let i=0; i<totalDays; i++){
        const dayObj = new Date(startDate);
        dayObj.setDate(startDate.getDate() + i);

        const year = dayObj.getFullYear();
        const month = dayObj.getMonth();
        const day = dayObj.getDate();

        const dayRow = document.createElement('div');
        dayRow.classList.add('day-row');

        // Highlight today
        if(dayObj.toDateString() === today.toDateString()) dayRow.classList.add('today');
        // Highlight selected
        if(dayObj.toDateString() === selectedDate.toDateString()) dayRow.classList.add('selected');

        const dayLeft = document.createElement('div');
        dayLeft.classList.add('day-left');

        // New date format: year light color
        const weekdayAbbr = dayObj.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase();
        const dayLabel = document.createElement('span');
        dayLabel.classList.add('day-label');
        dayLabel.innerHTML = `<span class="year-light">${year}</span>-${month+1}-${day} ${weekdayAbbr}`;
        dayLeft.appendChild(dayLabel);

        const key = formatKey(dayObj);
        const events = lineCalData[key] || [];
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
                    if(events.length===0) delete lineCalData[key];
                    else lineCalData[key]=events;
                    localStorage.setItem('lineCalData', JSON.stringify(lineCalData));
                    renderDays(selectedDate);
                }
            };
            evSpan.appendChild(delBtn);
            dayLeft.appendChild(evSpan);
        });

        dayRow.appendChild(dayLeft);
        dayRow.onclick = ()=>{
            selectedDate = new Date(dayObj);
            renderDays(selectedDate);
        };

        calendarContainer.appendChild(dayRow);
    }

    // Scroll selected day into view
    const selectedRow = document.querySelector('.day-row.selected');
    if(selectedRow) selectedRow.scrollIntoView({behavior:'smooth', block:'center'});
}

// Add event button
addEventBtn.onclick = ()=>{
    inputPanel.classList.remove('hidden');
    eventInput.focus();
};

// Save event
saveEventBtn.onclick = ()=>{
    let val = eventInput.value.trim();
    if(val===''){inputPanel.classList.add('hidden'); return;}

    const key = formatKey(selectedDate);
    if(!lineCalData[key]) lineCalData[key]=[];
    lineCalData[key].push(val);

    localStorage.setItem('lineCalData', JSON.stringify(lineCalData));
    eventInput.value='';
    inputPanel.classList.add('hidden');
    renderDays(selectedDate);
};

// Go to today
goTodayBtn.onclick = ()=>{
    selectedDate = new Date(today);
    renderDays(selectedDate);
};

// Hide input panel when clicking outside
document.addEventListener('click',(e)=>{
    if(!inputPanel.contains(e.target) && e.target!==addEventBtn)
        inputPanel.classList.add('hidden');
});

// Initial render
renderDays(selectedDate);
