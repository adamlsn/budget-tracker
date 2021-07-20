let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event){
    db = event.target.result;

    db.createObjectStore("new_transaction", { autoIncrement: true })
};

request.onsuccess = function(event){
    db = event.target.result;

    if (navigator.onLine){
        uploadTransactions(db);
    };
};

request.onerror = function(event){
    console.log(event.target.errorCode);
};

function saveRecord(record){
    const transaction = db.transaction(["new transaction"], "readwrite");
    const transactionObjectStore = transaction.objectStore("new_transaction");
    
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function(){
        if(getAll.result.length > 0){
            fetch("api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if(serverResponse.message){
                        throw new Error(serverResponse);
                    }

                const transaction = db.transaction(["new_transaction"], "readwrite");
                const transactionObjectStore = transaction.objectStore("new_transaction");

                transactionObjectStore.clear();

                alert("Saved transactions are submitted.");
            });
        }
    }
}

window.addEventListener("online", uploadTransactions);