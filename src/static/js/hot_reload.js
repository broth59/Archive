const webSocket = new WebSocket('ws:localhost:3212')
  
webSocket.onopen = function(){
  console.log('Websocket has been connected')  
}			   

webSocket.onmessage = function(){  
  location.reload(true) 
  // location.href = location.href
}    
