const loginForm = document.getElementById('login')

const showPass = () => {
    const password = document.getElementById('loginPassword');
    password.type = (password.type === "password") ? "text" : "password";
}

if(loginForm){
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const data = { email, password }
        
        fetch('/login', {
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

const getSignupPage = () => {
    window.location.href = '/'
}