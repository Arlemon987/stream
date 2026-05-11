const myIdDiv = document.getElementById("myId");
const remoteInput = document.getElementById("remoteId");
const connectBtn = document.getElementById("connectBtn");

const shareBtn = document.getElementById("shareBtn");
const stopBtn = document.getElementById("stopBtn");

const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let currentCall;

const peer = new Peer();

peer.on("open", (id) => {

myIdDiv.innerText = id;

new QRCode(document.getElementById("qrcode"), {
text: id,
width: 180,
height: 180
});

});

shareBtn.onclick = async () => {

try{

localStream = await navigator.mediaDevices.getDisplayMedia({
video:true,
audio:true
});

alert("Screen sharing ready.");

}catch(err){
alert("Permission denied.");
}

};

connectBtn.onclick = () => {

const remoteId = remoteInput.value.trim();

if(!remoteId){
alert("Enter Device ID");
return;
}

const call = peer.call(remoteId, localStream || new MediaStream());

currentCall = call;

call.on("stream", (remoteStream) => {

remoteVideo.srcObject = remoteStream;

});

};

peer.on("call", async (call) => {

if(!localStream){

try{

localStream = await navigator.mediaDevices.getDisplayMedia({
video:true,
audio:true
});

}catch(err){
return;
}

}

call.answer(localStream);

currentCall = call;

});

stopBtn.onclick = () => {

if(localStream){

localStream.getTracks().forEach(track => track.stop());

}

if(currentCall){

currentCall.close();

}

remoteVideo.srcObject = null;

};
