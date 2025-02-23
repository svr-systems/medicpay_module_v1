import Auth from "./middleware/Auth";
import UsrAdmin from "./middleware/UsrAdmin";
// import UsrUser from "./middleware/UsrUser";

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
          title: "Usuarios",
          link: "users",
          icon: "mdi-account-multiple",
          show: UsrAdmin(),
        },
      ],
    },
    { divider: true },
    // {
    //   links: [
    //     {
    //       title: "Mi perfil",
    //       link: "users.profile",
    //       icon: "mdi-card-account-details",
    //       show: UsrUser(),
    //     },
    //   ],
    // },
    { divider: true },
  ];

  return side_bar_items;
};
