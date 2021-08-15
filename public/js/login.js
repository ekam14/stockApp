const loginForm = document.getElementById('login')

const showPass = () => {
    const password = document.getElementById('loginPassword');
    password.type = (password.type === "password") ? "text" : "password";
}

if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        try{
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const data = { email, password }
            
            const response = await fetch('/login', {
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

const getSignupPage = () => {
    window.location.href = '/'
}