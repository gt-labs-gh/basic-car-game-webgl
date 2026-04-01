const SOCKET_URL = "http://127.0.0.1:8801";

export class GameApi {
  _socket = null;

  connect(token) {
    this._socket = io(`${SOCKET_URL}`, {
      path: "/game",
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: false,
      auth: (cb) => {
        cb({
          token,
        });
      },
    });

    this._socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);

    //Seems like we dont need the setTimeOut - to verify with Pasha
    //   setTimeout(() => {
    //     this._socket.connect();
    //   }, 1000);
    });

    this._socket.connect();
  }

  notifyLaneChange(lane) {
    if(!this._socket)
      return;
    console.log("Notifying lane change:", lane);
    this._socket.emit("/lane_change", {
      lane,
    });
  }

  notifyBuy(lane) {
    if(!this._socket)
      return;

    //Create idempotency key to prevent duplicate orders on retry
    //Persist key in DB

    this._socket.emit("/buy", {
      lane,
      
    });
}

  notifySell(lane) {
      if(!this._socket)
        return;

      //Create idempotency key to prevent duplicate orders on retry
      //Persist key in DB

      this._socket.emit("/sell", {
        lane,
      });
    } 
  }
