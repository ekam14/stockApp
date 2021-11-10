const sellModal = (id) => {
    const modal = document.querySelector('.modal-content');

    document.getElementById('myModal').style.display = "block";

    const div = document.getElementById(id);
    let companyName = div.querySelector('.companyName').textContent;
    let qty = div.querySelector('.qty').textContent;
    let currentPrice = div.querySelector('.currentPrice').textContent;

    console.log(companyName, qty, currentPrice)

    modal.innerHTML = `<span class="close" onclick="closeModal()">&times;</span>
    <p>${companyName}</p>
    <p>Max Sell Capacity: ${qty}</p>
    <form id='stockSellForm'>
        <input type="text" id="stockQty" oninput="checkBalance(${qty})" placeholder="Stock Qty" autocomplete="off">
        Current Price: <label>${currentPrice} USD</label>
        <button type="submit" id=${id}>Sell</button>
    </form>`;
}

const stockSellForm = document.getElementById('stockSellForm');

if(stockSellForm){
    stockSellForm.addEventListener('submit', async (e) => {
        console.log("hello");
        e.preventDefault();
    
        try{
            console.log(document.querySelector('button[type="submit"]'));
        }catch(err){
            alert(err);
        }
    })
}

const checkBalance = (possibleQty) => {
    let stockQty = document.getElementById('stockQty').value;

    stockQty = (stockQty) ? stockQty : 0;

    if(stockQty > possibleQty) {
        document.getElementById('stockQty').value = 0;
        alert('Insufficient Balance!');
    }
}

const closeModal = () => {
    document.getElementById('myModal').style.display = "none";
}