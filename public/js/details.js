const modal = document.getElementById('myModal')
const stockBuyForm = document.getElementById('stockBuyForm')

const checkBalance = (possibleQty) => {
    let stockQty = document.getElementById('stockQty').value;

    stockQty = (stockQty) ? stockQty : 0;

    if(stockQty > possibleQty) {
        document.getElementById('stockQty').value = 0;
        alert('Insufficient Balance!');
    }
}

const buyModal = () => {
    modal.style.display = "block";
}

const closeModal = () => {
    modal.style.display = "none";
}
stockBuyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try{
        let stockQty = parseInt(document.getElementById('stockQty').value);
        let companyName = document.getElementById('companyName').innerText;
        let symbol = document.getElementById('symbol').innerText;
        let boughtPrice = parseInt(document.getElementById('price').innerText);

        const data = { companyName, symbol, boughtPrice, 
            quantity: stockQty, netAmount: boughtPrice * stockQty };


        const response = await fetch('/purchaseStock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if(response.ok) window.location.href = '/portfolio';
    }catch(err){
        alert(err);
    }
})