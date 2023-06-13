// javascript

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'
import {getDatabase, ref, push, onValue, remove, child} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

const firebaseConfig = {
    databaseURL : "https://project-endorsements-board-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase()
const endorsementsInDB = ref(database, "endorsements")
const sendersInDB = ref(database, "senders")
const receiversInDB = ref(database, "rececivers")

const inputBtnEl = document.getElementById("input-btn")
const inputBoxEl = document.getElementById("input-box")
const inputBoxSenderEl = document.getElementById("input-box-sender")
const inputBoxReceiverEl = document.getElementById("input-box-receiver")
const ulEl = document.getElementById("publish-list")
const likedEl = document.getElementById("liked")

function getInputValue(){
    let inputValue = inputBoxEl.value
    inputBoxEl.value = ""
    return inputValue
}

function getSender(){
    let sender = inputBoxSenderEl.value
    inputBoxSenderEl.value = ""
    return sender
}

function getReceiver(){
    let receiver = inputBoxReceiverEl.value
    inputBoxReceiverEl.value = ""
    return receiver
}

function getLiElement(sender, receiver, content, likeCount){
    let endorsementEl = document.createElement("li")
    endorsementEl.setAttribute("class", "endorsements")    
    endorsementEl.innerHTML = `<div><p id="endorsement-receiver">To ${receiver}</p> 
                                ${content}<div id="sender-container"><p id='endorsement-sender'>From ${sender}</p></div></div>`
    
    return endorsementEl.outerHTML
}

inputBtnEl.addEventListener("click", function(){
    push(endorsementsInDB, {sender: getSender(), receiver: getReceiver(), content:getInputValue(), liked: 1})
})

onValue(endorsementsInDB, (snapshot)=>{
    if (snapshot.exists()){
        let endorsements = Object.entries(snapshot.val())
        let endorsementEl = ""

        for (let i = 0; i < endorsements.length; i++){
            let latestRecord = endorsements[i]
            let latestRecordKey = latestRecord[0]
            let latestRecordValue = latestRecord[1]        
            endorsementEl += getLiElement(latestRecordValue.sender, latestRecordValue.receiver, latestRecordValue.content, latestRecordValue.liked)   
        }
        
        ulEl.innerHTML = `<ul>${endorsementEl}</ul>`
    }else{
        ulEl.innerHTML = `<ul><li>Simply write something...</li></ul>`
    }
    
})

