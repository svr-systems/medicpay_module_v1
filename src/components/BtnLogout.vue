<template>
  <v-tooltip left>
    <template v-slot:activator="{ on }">
      <v-btn small v-on="on" icon @click.prevent="logoutHandle">
        <v-icon small> mdi-logout-variant </v-icon>
      </v-btn>
    </template>
    Cerrar Sesión
  </v-tooltip>
</template>

<script>
import { URL_API, getHdrs, getErr } from "@/general";
import Axios from "axios";

export default {
  props: ["small"],
  data: () => ({
    color: null,
    msg: null,
    visible: false,
  }),
  methods: {
    logout() {
      this.$store.dispatch("logoutAction");
      this.$router.push({ name: "login" });
    },
    logoutHandle() {
      this.drawerVal = false;

      this.$root.$confirm("¿Cerrar sesión?").then((confirmed) => {
        if (confirmed) {
          Axios.get(
            URL_API + "/auth/logout",
            getHdrs(this.$store.getters.getAuth.token)
          )
            .then((rsp) => {
              this.logout();
            })
            .catch((err) => {
              this.$root.$alert("error", getErr(err));
              this.logout();
            });
        }
      });
    },
  },
};
</script>
