const socket = io();

let username;

Swal.fire({
    title: "Identifícate",
    input: "email",
    text: "Ingresa tu correo electrónico.",
    inputValidator: (value) => {
        return !value && "Es obligatorio un correo electrónico.";
    },
    allowOutsideClick: false,
}).then((result)=>{
    email = result.value;
    socket.emit("new-user", email);
})

const chatInput = document.getElementById("chat-input");

chatInput.addEventListener("keyup", (ev)=>{

    if(ev.key === "Enter"){
        const inputMessage = chatInput.value;
        if(inputMessage.trim().length > 0){
            socket.emit("chat-message", {email, message: inputMessage});
            chatInput.value = "";
        }
    }
})

const messagesPanel = document.getElementById("messages-panel");

socket.on("messages", (data)=>{
    let messages = "";

    data.forEach((m) => {
        messages += `<b>${m.email}:</b>${m.message}</br>`
    });
    messagesPanel.innerHTML = messages;
})

socket.on("new-user",(email)=>{
    Swal.fire({
        title: `${email} se ha unido al chat`,
        toast: true,
        position:"top-end"
    })
})