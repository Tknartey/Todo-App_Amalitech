//theme change
document.querySelector('.themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light'); 
});

 // Get all the links
 const links = document.querySelectorAll(".center-items a");

  // Set the 'all' link as the default selected link color blue

 let defaultColor = 'rgba(58, 124, 253, 1)'; 
 let previousColor = ""; 

let selectedLink = document.getElementById("all");
selectedLink.style.color = defaultColor;

    // Reset the font color of the previously selected link
 links.forEach(function(link) {
  link.addEventListener("click", function() {
  
    if (selectedLink !== link) {
      selectedLink.style.color = previousColor;
    }

    previousColor = link.style.color; 
    link.style.color = defaultColor;

    selectedLink = link;
  });
});

//getting Items 
const formIinputContainer = document.querySelector('.input');

const formValue = document.querySelector('#new-todo');

const alert = document.querySelector('.alert');
const alertInformation = document.querySelector('#alert-information');

const listParent = document.querySelector('.list-items');

const activeClass = document.querySelectorAll('.center-items a');

const completed = document.getElementById('clearCompleted');

const leftItem = document.getElementById('sides-value');

// fn for clr completed
completed.addEventListener('click',()=>{
  document.querySelectorAll('.checkInput').forEach(checkBox=>{
      if (checkBox.checked){
          const id = checkBox.parentElement.parentElement.id;
          checkBox.parentElement.parentElement.remove();
          removeFromLocalStorage(id);
      }
  });
});

activeClass.forEach(anchor => {
  anchor.addEventListener('click',(e)=>{
      e.currentTarget.href = '#';
       e.preventDefault();
     if(e.currentTarget.id == 'all') {
         e.currentTarget.href = '/';
       document.querySelectorAll('.checkInput').forEach(checkBox=>{
           checkBox.parentElement.parentElement.style.display = 'flex'; 
       });
     }
     if(e.currentTarget.id == 'active') {
       e.currentTarget.href = '/';
       document.querySelectorAll('.checkInput').forEach(checkBox=>{
           checkBox.parentElement.parentElement.style.display = 'flex';
       });
   
       document.querySelectorAll('.checkInput').forEach(checkBox=>{
           if (checkBox.checked){
               checkBox.parentElement.parentElement.style.display = 'none';
           }
       });
     }

      if(e.currentTarget.id == 'completed') {
       e.currentTarget.href = '/';
       document.querySelectorAll('.checkInput').forEach(checkBox=>{
           checkBox.parentElement.parentElement.style.display = 'flex';
       });
   
       document.querySelectorAll('.checkInput').forEach(checkBox=>{
           if (!checkBox.checked){
               checkBox.parentElement.parentElement.style.display = 'none';
           }
       });

       
       }
  });
});

//fn to count items left
const checkLeftItem = () =>{
  let totalItem = listParent.children.length;
  let count = 0;
  document.querySelectorAll('.checkInput').forEach((checkBox,index) =>{
      if (checkBox.checked){
         count++;
      }
  });
  leftItem.textContent  = totalItem-count;
}
//passing message to users
const displayAlert = (text,action) =>{
  alertInformation.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(()=>{
      alert.classList.remove(`alert-${action}`);
      alertInformation.textContent = '';
  },2000);
};

//set back to default
const setBackToDefault = () =>{
  formValue.value = '';
};

//creating form event listener
formIinputContainer.addEventListener('submit',(e)=>{
  e.preventDefault(); //preventing submitting automatically
  const id = new Date().getTime().toString();
  const value = formValue.value;
  if(!value){
      displayAlert('Please enter an item to add!','danger');
  }
  else{
      createTodoItem(id,value);
      displayAlert('Item Added!','success');
      addToLocalStorage(id,value);
      setBackToDefault();
      checkLeftItem();
  }
});

const createTodoItem = (id, value) => {
  const element = document.createElement('li');
  element.classList.add('list-infos');
  element.setAttribute('id', id);
  
  //check eligibility before submitting
  element.classList.add('draggable');
  element.setAttribute('draggable', true);

  element.innerHTML = `
    <div class="checkboxContainer">
        <input class="checkInput" type="checkbox" hidden>
        <label for="checkInput" class="checkboxLabel"></label>
    </div>
    <p class="item-info">${value}</p>
    <div class="close-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
        </svg>
    </div>
    `;

  listParent.insertBefore(element, listParent.firstChild);

  // removing and adding list depending on functionality .
  const labels = document.querySelectorAll('.checkboxLabel');
  const close = document.querySelectorAll('.close-container svg');

  for (let i = 0; i < labels.length; i++) {
    labels[i].addEventListener('click', checkCurrent);
  }

  for (let i = 0; i < close.length; i++) {
    close[i].addEventListener('click', RemoveCurrent);
  }

};


// Drag and Dropo functionalities

let dragindex=0;
let dropindex=0;
let clone="";

 function setupDragAndDrop() {
  const listItems = document.querySelectorAll('.list-infos');

   let draggedItem = null;

   listItems.forEach((item) => {
     item.setAttribute('draggable', true);

     item.addEventListener('dragstart', (event) => {
       draggedItem = event.currentTarget;
       event.dataTransfer.effectAllowed = 'move';
       event.dataTransfer.setData('text/html', draggedItem);
     });

     item.addEventListener('dragover', (event) => {
       event.preventDefault();
       event.dataTransfer.dropEffect = 'move';
     });

     item.addEventListener('drop', (event) => {
       event.preventDefault();
       const droppedItem = event.currentTarget;
       const parent = droppedItem.parentNode;

       // Swap the elements
       const temp = document.createElement('div');
       parent.insertBefore(temp, draggedItem);
       parent.insertBefore(draggedItem, droppedItem);
       parent.insertBefore(droppedItem, temp);
       parent.removeChild(temp);

       // Update the positions in local storage
       const items = JSON.parse(localStorage.getItem('list'));
       const draggedIndex = Array.from(parent.children).indexOf(draggedItem);
       const droppedIndex = Array.from(parent.children).indexOf(droppedItem);
       const tempItem = items[draggedIndex];
       items[draggedIndex] = items[droppedIndex];
       items[droppedIndex] = tempItem;
       localStorage.setItem('list', JSON.stringify(items));
     });
   });
 }

//checkbox and strikethrough 
const checkCurrent = (e)=>{
  const label = e.currentTarget;
  label.classList.toggle('checkActive');

  const isLight = document.body.classList.contains('light');

  if (label.classList.contains('checkActive')){
      label.parentElement.nextElementSibling.style.textDecoration = 'line-through';
      label.parentElement.nextElementSibling.style.color = isLight ? '#D1D2DA' : '#4D5067';
      label.previousElementSibling.checked = true;
  }
  else{
      label.parentElement.nextElementSibling.style.textDecoration = 'none';
     
  }
  checkLeftItem();
};

// list on local storage
const RemoveCurrent = (e) =>{
  const parentContainer = e.currentTarget.parentElement.parentElement;
  const id = parentContainer.id;
  listParent.removeChild(parentContainer);
  displayAlert('Item removed successfully!','success');
  removeFromLocalStorage(id);
  checkLeftItem();
  setBackToDefault();
};


const removeFromLocalStorage = (id)=>{
  let items = getLocalStorage();
  items = items.filter(item=>{
      if(item.id !== id){
          return items;
      }
  });
  localStorage.setItem('list',JSON.stringify(items));
};

const addToLocalStorage = () => {
const items = [];
listParent.querySelectorAll('.list-infos').forEach((item, index) => {
  const id = item.id;
  const value = item.querySelector('.item-info').textContent;
  items.push({ id, value, position: index });
});
localStorage.setItem('list', JSON.stringify(items));
};


const getLocalStorage = () =>{
  return localStorage.getItem('list')
  ? JSON.parse(localStorage.getItem('list'))
  :[];
};

const setupItems = () => {
let items = getLocalStorage();
if (items.length > 0) {
  items.sort((a, b) => a.position - b.position);
  items.forEach((listItem) => {
    createTodoItem(listItem.id, listItem.value, listItem.position);
  });
}
checkLeftItem();
setupDragAndDrop();
};

window.addEventListener('load',setupItems);