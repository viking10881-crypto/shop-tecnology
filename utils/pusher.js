import Pusher from "pusher-js";

export const pusherClient = new Pusher("TU_KEY", {
  cluster: "mt1",
});
