import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "EV Map",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "Push Notification↗️",
    path: "https://chromewebstore.google.com/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj",
    newTab: true,
  },
  {
    id: 4,
    title: "Opt In↗️",
    path: "https://staging.push.org/channels",
    newTab: true,
  }
];
export default menuData;
