import { useEffect } from "react";
import { socket } from "../Services/Socket";
import { useDispatch } from "react-redux";
import { addMessageRealtime } from "../Redux/messageSlice";

const useSocket = (user) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    socket.emit("setup", user);

    socket.on("message_received", (msg) => {
      dispatch(addMessageRealtime(msg));
    });

    return () => {
      socket.off("message_received");
    };
  }, [user]);
};

export default useSocket;



