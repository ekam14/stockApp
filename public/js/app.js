const stockForm = document.querySelector('#stockPurchaseForm')
const stockName = document.getElementById('stockName')
const noStocks = document.getElementById('noStocks')
const probableStocks = document.querySelector('#probableStocks')

const personalDetailsForm = document.getElementById('personalDetails')

if(personalDetailsForm){
    personalDetailsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        try{
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const dob = document.getElementById('dob').value;

            if(new Date(dob).getTime() > new Date().getTime()) {
                throw new Error('DOB cannot be greater than present!!')
            }

            if(!firstName || !lastName || !email || !password || !dob) {
                throw new Error('Fill out all details...')
            } 

            const data = { firstName, lastName, email, password, dob }

            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if(response.ok) window.location.href = '/purchase';
        }catch(err){
            alert(err);
        }
    })
}

if(stockForm) {
    stockForm.addEventListener('input', async (e) => {
        e.preventDefault();
    
        try{
            let totalStocks = (noStocks.value) ? noStocks.value : 3;
    
            let detailsPath = '/details';
        
            // for sending request to backend for probable words for a word
            const response = await fetch('/probableWords?word=' + stockName.value)
            
            const data = await response.json();
            
            // for resetting
            probableStocks.innerHTML = (data.length) ? "Probable Stocks" : "";
            
            for(let index = 0; index < totalStocks && index < data.length; index ++){
                probableStocks.innerHTML += `<div class='li-box'><li><a href='${detailsPath}?symbol=${data[index]}'>${data[index]}</a></li></div>`;
            }
            
            if(!data) {
                probableStocks.innerHTML = "<p>No stocks!</p>";
            }
        }catch(err){
            alert(err)
        }
    })

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        stockName.value = '';
    })
}

const getLoginPage = () => {
    window.location.href = '/login'
}

const logout = async () => {
    try{
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    
        if(response.ok) window.location.href = '/';
    }catch(err){
        alert('Not Authorized')
    }
}

const showPass = () => {
    const password = document.getElementById('password');
    password.type = (password.type === "password") ? "text" : "password";
}