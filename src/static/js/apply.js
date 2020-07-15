//Syntax Highlight 적용
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });          
});

const webSocket = new WebSocket('ws:localhost:3211')

webSocket.onopen = function(){
  console.log('Websocket has been connected')  
}			

webSocket.onmessage = function(){
  location.reload(true)
  // location.href = location.href
}  