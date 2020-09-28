


document.addEventListener('DOMContentLoaded', (e)=>{
  //get name input field
  const nameInput = document.getElementById('name');
  //get email input field
  const emailInput = document.getElementById('mail');
  //get job role dropdown
  const jobRoleInput = document.getElementById('title');
  //get the input text field for "other" job roles
  const otherJobRoleInput = document.getElementById('other-title');
  //t-shirt field block
  //get t-shirt size field
  const t_size = document.getElementById('size');
  //get t-shirt design field
  const t_design = document.getElementById('design');
  //get t-shirt color div
  const t_color_block = document.getElementById('shirt-colors');
  t_color_block.style.display = 'none';
  //get t-shirt color field
  const t_color = document.getElementById('color');
  //get activities section
  const activities = document.getElementsByClassName('activities')[0];
  //get all checkboxes for the workshops
  const workshops = document.querySelectorAll('input[type=checkbox]');

  //get field for the total cost and hide it until an activity is shown
  const totalCostField = document.getElementById('totalCost');
  totalCostField.style.display = 'none';

  //set initial cost to 0 before workshops are selected
  let totalCost = 0;

  // select credit card fields
  const cc_num = document.getElementById('cc-num');
  const zip = document.getElementById('zip');
  const cvv = document.getElementById('cvv');

  //get payment type dropdown
  const paymentType = document.getElementById('payment');
  //hide payment fields by default
  document.getElementById('credit-card').style.display ='block';
  document.getElementById('paypal').style.display ='none';
  document.getElementById('bitcoin').style.display ='none';

  paymentType.getElementsByTagName('option')[1].selected = 'selected';
  paymentType.getElementsByTagName('option')[0].disabled = true;


  //hide the "other" job field by default
  otherJobRoleInput.style.display = 'none';

  //CODE FOR SHOWING T-shirt selector at the beginning with no options
  // NOT IN USE as field is hidden until t-shirt design is selected
/*
  const defaultColor = document.createElement('option');
  const defaultColorText = document.createTextNode('Please select a T-shirt theme');
  defaultColor.selected = true;
  //defaultColor.value = '';
  defaultColor.appendChild(defaultColorText);


  t_color.insertBefore(defaultColor, t_color.firstChild);

  //hide the t-shirt colors until design is selected by hiding options from html

  const currentOptions = t_color.options;
  for(let i=currentOptions.length; i>1; i--){
    currentOptions[i-1].style.display ='none';
  }
*/

  //focus on name input when page is loaded
  nameInput.focus();

  //create text input field when "other" is selected as jobRole
  jobRoleInput.addEventListener('change',(e)=>{
    //Give the field an id of “other-title,” and add the placeholder text of "Your Job Role".
    if(jobRoleInput.value ==='other'){
      otherJobRoleInput.style.display = 'block';
    }
    else if(jobRoleInput.value !=='other'){
      otherJobRoleInput.style.display = 'none';
    }
  });

// Event listener to show corresponding colors in dropdown for each design
    t_design.addEventListener('change',(e)=>{

      const currentOptions = t_color.options;
      const design = t_design.value;
      // if design is selected, show colors available for that design
      if(design){
        let firstOption = 0;
        for(let j=0; j<currentOptions.length; j++){
          // replace heart icon in color options in order to use lookup to match design name. hide other options
          const color = (currentOptions[j].text.indexOf('♥')>=0)? currentOptions[j].text.replace('♥','heart').toLowerCase(): currentOptions[j].text.toLowerCase();
          if(color.indexOf(design)>=0){
            currentOptions[j].style.display ='block';
            //assign the index of the first option that's displayed in order to select it
            if(firstOption===0){
              firstOption = j;
            }
          }
          else{
            currentOptions[j].style.display ='none';
          }
        }

        currentOptions[firstOption].selected =true;

        t_color_block.style.display = 'block';
      }

    });
    // Add event listener for change
    document.addEventListener('change',(e)=>{
      //Workshop Selection condition to verify if checkbox

      if(e.target.type ==='checkbox'){
        const workshopName= e.target.name;
        const workshopDayTime = e.target.getAttribute("data-day-and-time");
        let workshopCost = parseInt(e.target.getAttribute("data-cost"));

        //check if form was already submitted without activities to remove the class once clicked
        if(e.target.checked && activities.classList.contains('notValid')){
            activities.classList.remove("notValid");
        }
        //if checkbox is being unchecked, then price needs to be removed
        else if(!e.target.checked){
          workshopCost = -1 * workshopCost; //multiplied by -1 to since it's being removed
          console.log(workshopCost);
        }
        //adjust total price
        totalCost += workshopCost;
        // hide events at the same time
        for(let l=1; l<workshops.length; l++){
          const dateTime = workshops[l].getAttribute("data-day-and-time");

          if(workshopDayTime === dateTime && workshopName !==workshops[l].name){
            workshops[l].disabled = e.target.checked; //will resolve to true if checked, false if not
            workshops[l].parentElement.className = e.target.checked? 'disabled': ''; // if being checked, disable activities at matching times, if being uncheck, uncheck them
          }
        }


      }

        //Show the total cost after selections are made
        totalCostField.style.display = 'block';
        totalCostField.innerText = `Total Cost: ${totalCost}`;

      //END OF WORKSHOP SELECTION

    });
    //show payment option blocks based on payment type selection
    paymentType.addEventListener('change',(e)=>{
      const paymentSelection = e.target.value;
      //show block based on selected payment type
      if(paymentSelection ==='credit card'){
        document.getElementById('credit-card').style.display ='block';
        document.getElementById('paypal').style.display ='none';
        document.getElementById('bitcoin').style.display ='none';
      }
      else if(paymentSelection ==='bitcoin'){
        document.getElementById('credit-card').style.display ='none';
        document.getElementById('paypal').style.display ='none';
        document.getElementById('bitcoin').style.display ='block';
      }
      else if(paymentSelection ==='paypal'){
        document.getElementById('credit-card').style.display ='none';
        document.getElementById('paypal').style.display ='block';
        document.getElementById('bitcoin').style.display ='none';
      }
    });
    //Validate text fields as user exits them
    document.addEventListener('focusout',(e)=>{
      const field = e.target.name;
      const entry = e.target.value;
      //combine regex into object to simplify if statements below
      const regExList ={'user-name': /^[a-z]+$/i,'user-email':/^\w+@\w+\.\w+$/i,
      'user-cc-num':/^\d{13,16}|(\d{4}[-|\s]?\d{4}[-|\s]?\d{4}[-|\s]?\d{4})$/, 'user-zip': /^\d{5}$/, 'user-cvv': /^\d{3}$/};
      //test for regex and apply class if valid/not valid
      if(regExList[field]){
        console.log(field);
        if(regExList[field].test(entry)){
          e.target.className = 'isValid';
        }
        else{
          e.target.className = 'notValid';
        }
      }

    });
    //Add event listeners on submit button click
    document.addEventListener('submit',(e)=>{
      //When submitted, clear previous error messages if they exist
      if(document.getElementById('error') !== null){
        document.getElementById('error').innerHTML = '';
      }
      //check if name input is empty or already invalidated
      if(nameInput.value === '' ){
        e.preventDefault();
        createAlertBox('Please enter a name.');
      }
      else if(nameInput.style.className === 'notValid'){
        e.preventDefault();
        createAlertBox('Please correct the name field above.');
      }
      //check if email input is empty or already invalidated
      if(emailInput.value === ''){
        e.preventDefault();
        createAlertBox('Please enter an email address.');
        //button.parentElement.insertBefore(p, button);
      }
      else if(emailInput.style.className === 'notValid'){
        e.preventDefault();
        createAlertBox('The email address is invalid. Please re-enter your email address.');
      }
      //check if an activity is selected by checking if the cost is not 0
      if(totalCost === 0 ){
        e.preventDefault();
        activities.classList.add('notValid');
        createAlertBox('Please select at least 1 Activity.');
      }
      //check if payment method is selected
      if(paymentType.value === 'select method'){
        e.preventDefault();
        createAlertBox('Please select a payment method.');

      }
      //if payment type is credit card, check all fields to make sure they're not empty or invalid
      else if(paymentType.value === 'credit card' && (cc_num.style.className === 'notValid' || cc_num.value ==='' || zip.style.className === 'notValid' || zip.value ==='' || cvv.style.className === 'notValid' || cvv.value ==='')){
        e.preventDefault();
        const ccnumberFormatted = cc_num.value.replace(/-|\s/g, '');
        //Custom error messages based on errors in credit card fields
        if(ccnumberFormatted.length <13 || ccnumberFormatted.length > 16){
          createAlertBox('Credit Card Number should be between 13 and 16 characters.');
        }
        if(cvv.value.length !== 3){
          createAlertBox('Credit Card CVV should be 3 digits.');
        }
        if(zip.value.length !== 5){
          createAlertBox('Credit Card Zip Code should be 3 digits.');
        }

      }
    });
    //function to update error messages on page
    function createAlertBox(message){
      const button = document.getElementsByTagName('button')[0];
      console.log(document.getElementById('error'));

      if(document.getElementById('error') !== null){
        console.log('error exists');
        let p = document.getElementById('error');
        if(p.innerHTML !==''){
          p.innerHTML += '<br>';
        }
        p.innerHTML += `${message}`;
      }
      else{
        //Create an error box above button
        p = document.createElement('p');

        p.id = 'error';
        p.style.color = 'red';
        p.style.border ='solid';
        p.style.padding = '5px 5px 5px 5px'
        p.style.borderColor = 'red';
        p.style.backgroundColor = 'white';
        p.innerText = message;
        button.parentElement.insertBefore(p, button);
        }
        return p;
    }

});
