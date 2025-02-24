import Auth from "./middleware/Auth";
import UsrModule from "./middleware/UsrModule";

export const getSideBarItems = () => {
  const side_bar_items = [
    {
      links: [
        {
          title: "Inicio",
          link: "home",
          icon: "mdi-home",
          show: Auth(),
        },
        {
          title: "Consultas",
          link: "module/consultations",
          icon: "mdi-medical-bag",
          show: UsrModule(),
        },
      ],
    },
  ];

  return side_bar_items;
};
