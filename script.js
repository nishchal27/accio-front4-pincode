document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lookupForm');
    const pincodeInput = document.getElementById('pincodeInput');
    const filterInput = document.getElementById('filterInput');
    const postOfficeList = document.getElementById('postOfficeList');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const resultsSection = document.getElementById('results');
  
    let postOffices = [];
  
    //attaching event listeners to the <form> tag
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const pincode = pincodeInput.value.trim();
  
      // Validate pincode
      if (!/^\d{6}$/.test(pincode)) {
        errorMessage.textContent = 'Please enter a valid 6-digit pincode.';
        return;
      }
  
      errorMessage.textContent = '';
      loader.hidden = false; //show loader
      postOfficeList.innerHTML = '';
      noResultsMessage.textContent = '';
      resultsSection.style.display = 'none';
  
      //try catch block
      try {
        //fetching data: a async process
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        loader.hidden = true; //hide loader after data fetch
  
        //error handling
        if (data[0].Status !== 'Success') {
          errorMessage.textContent = 'No data found for the entered pincode.';
          return;
        }
  
        postOffices = data[0].PostOffice || [];
        if (postOffices.length === 0) {
          noResultsMessage.textContent = "Couldn't find the postal data you’re looking for...";
          return;
        }
  
        //showing result section
        resultsSection.style.display = 'block';
        filterInput.hidden = false;
        displayPostOffices(postOffices);
      } catch (error) {
        loader.hidden = true;
        errorMessage.textContent = 'An error occurred while fetching data.';
      }
    });
  
    filterInput.addEventListener('input', () => {
        //converting to lowercase
      const filterValue = filterInput.value.toLowerCase();
    //   filtering data based on first letter fo thr input 
      const filteredOffices = postOffices.filter(office =>
        office.Name.toLowerCase().includes(filterValue)
      );
  
      if (filteredOffices.length === 0) {
        noResultsMessage.textContent = "Couldn't find the postal data you’re looking for...";
      } else {
        noResultsMessage.textContent = '';
      }
  
      //dynamic update: update the filter result
      displayPostOffices(filteredOffices);
    });
  
    function displayPostOffices(offices) {
      postOfficeList.innerHTML = offices
        .map(
          office => `<li>
            <strong>${office.Name}</strong><br>
            Pincode: ${office.Pincode}<br>
            District: ${office.District}<br>
            State: ${office.State}
          </li>`
        )
        .join('');
    }
  });
  