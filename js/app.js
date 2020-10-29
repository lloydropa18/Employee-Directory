// Variables
const employees = document.querySelectorAll('.employee')
const employeeList = document.getElementById('employeeList')
const main = document.querySelector('main');
const overlay = document.querySelector('.overlay')
const overlayBtn = document.getElementById('overlayBtn')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')


// Fetching API
fetch('https://randomuser.me/api?results=12')
    .then(checkStatus)
    .then(response =>  response.json())
    .then(generateDetails)
    .then(appendToHtml)  
    .catch(err => console.log('Looks like there was a problem!',err))    
   
// Handling Error
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// Generate Details for the Employee
function generateDetails(data){
    for (let i =0; i< `${data.results.length}`; i++){
        let person = data.results[i];
        employees[i].innerHTML = `
            <img src="${person.picture.medium}">
            <div class="employeeDetails">            
            <h3>${person.name.first} ${person.name.last}</h3>
            <p>${person.email}</p>
            <p>${person.location.state}, ${person.location.country}</p>
            </div>
        `;
    } 
    return data;
}

// Generate employee details html
function employeeDetail(person){
    const html = `
        <img id="close" src="https://img.icons8.com/metro/26/000000/close-window.png"/>
        <img id="personImg" src="${person.picture.large}">
        <h1>${person.name.first} ${person.name.last}</h1>
        <p>${person.email}</p>
        <p>${person.location.country}</p>
        <div class="employeeOtherDetailsOverlay">
            <p>${person.cell}</p> 
            <p>${person.location.street.number}, ${person.location.street.name}, ${person.location.city}, ${person.location.country}</p> 
            <p>Birthday: ${person.dob.date.substring(0,10)}</p>
        </div>      
    `;
    return html;
}

// Generate Close Event Handler
function closeOverlay(element){
    const closepng = element.querySelector('#close');    
    closepng.addEventListener('click',()=>{
        overlay.style.display = "none";
        element.remove()
    })
}


// Overlay Function when click one of the employees
function appendToHtml(data){
    for (let i =0; i< data.results.length; i++){
        employees[i].addEventListener('click',(e)=> {
            let person = data.results[i];
            const div = document.createElement('div');
            div.innerHTML = employeeDetail(person);
            // Add Class To the Overlay Then Display
            div.classList.add('employeeDetailsOverlay');
            overlay.style.display = "flex";
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 70%)';
            overlay.insertBefore(div,overlayBtn);
            // Close Event Handler
            closeOverlay(div)


            // Overlay Button Event Handler
            overlayBtn.addEventListener('click',(e)=>{ 
                // Prev Event Handler
                if (e.target.textContent == "Prev"){
                    person = data.results[--i];
                    div.innerHTML = employeeDetail(person);
                    if (e.target.nextElementSibling.classList.contains('d-none')){
                        e.target.nextElementSibling.classList.remove('d-none')            
                    }
                    if (data.results.indexOf(person) == 0){
                        e.target.classList.add('d-none')
                    } 
                // Next Event Handler
                } else if (e.target.textContent == "Next"){
                    person = data.results[++i];
                    div.innerHTML = employeeDetail(person);
                    if (e.target.previousElementSibling.classList.contains('d-none')){
                        e.target.previousElementSibling.classList.remove('d-none')            
                    }
                    if (data.results.indexOf(person) == 11){
                        e.target.classList.add('d-none')
                    } 
                }
                // Close Event Handler On Overlay Button
                closeOverlay(div)
            }) 
        })
    }
    return data;
}

// Search Function
function search(){
    const val = searchInput.value;
    const exp = new RegExp(val , 'i');
    employees.forEach( employee =>{
        const person = employee.children[1].firstElementChild.textContent;
        const match = exp.test(person);
        if (!match){
            employee.classList.add('d-none')
        }else {
            employee.classList.remove('d-none')
        }
    })
}

// Search Event Handler
searchBtn.addEventListener('click',search);

