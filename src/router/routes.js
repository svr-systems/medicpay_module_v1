import Auth from "./middleware/Auth";
import Login from "./middleware/Login";
import UsrModule from "./middleware/UsrModule";

const routes = [
  //module
  {
    path: "/modulo/consultas",
    name: "module/consultations",
    component: () => import("@/views/module/Consultations.vue"),
    meta: {
      title: "Consultas",
      icon: "mdi-medical-bag",
      middleware: UsrModule,
    },
  },
  //general
  {
    path: "/",
    name: "main",
    component: () => import("@/views/general/Main.vue"),
    meta: {
      title: "SVR",
    },
  },
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/general/Login.vue"),
    meta: {
      title: "Iniciar Sesión",
      middleware: Login,
    },
  },
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: Auth,
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: Auth,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/general/NotFound.vue"),
  },
];

export default routes;
