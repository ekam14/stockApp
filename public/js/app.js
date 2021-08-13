const stockForm = document.querySelector('stockPurchaseForm')
const stockName = document.getElementById('stockName')
const noStocks = document.getElementById('noStocks')
const probableStocks = document.querySelector('#probableStocks')

const personalDetailsForm = document.getElementById('personalDetails')

if(personalDetailsForm){
    personalDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const dob = document.getElementById('dob').value;

        if(new Date(dob).getTime() > new Date().getTime()) {
            alert('DOB cannot be greater than present!!')
            return;
        }

        if(!firstName || !lastName || !email || !password || !dob) {
            alert('Fill out all details...')
            return;
        } 

        const data = { firstName, lastName, email, password, dob }

        fetch('/saveUserDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((response) => {
            // response does not throw catch
            if(response.ok) window.location.href = '/purchase';
            else alert(response.statusText);
        })
    })
}

if(stockForm) {
    stockForm.addEventListener('input', (e) => {
        e.preventDefault();
    
        let totalStocks = (noStocks.value) ? noStocks.value : 3;
    
        let detailsPath = '/details';
    
        // for sending request to backend for probable words for a word
        fetch('/probableWords?word=' + stockName.value).then((response) => {
            response.json().then((data) => {
                // for resetting
                probableStocks.innerHTML = (data.length) ? "Probable Stocks" : "";
                
                for(let index = 0; index < totalStocks && index < data.length; index ++){
                    probableStocks.innerHTML += `<div class='li-box'><li><a href='${detailsPath}?symbol=${data[index]}'>${data[index]}</a></li></div>`;
                }
                
                if(!data) {
                    probableStocks.innerHTML = "<p>No stocks!</p>";
                }
            })
        })
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(stockName.value);
        stockName.value = '';
    })
}

const getLoginPage = () => {
    window.location.href = '/login'
}

const showPass = () => {
    const password = document.getElementById('password');
    password.type = (password.type === "password") ? "text" : "password";
}