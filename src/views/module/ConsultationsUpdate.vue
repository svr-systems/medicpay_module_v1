<template>
  <v-card elevation="24" :disabled="ldg" :loading="ldg">
    <v-card-title>
      <v-row dense>
        <v-col cols="11">
          <BtnBack :route="{ name: route }" />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="1" class="text-right" />
      </v-row>
    </v-card-title>
    <v-card-text v-if="item">
      <v-form v-on:submit.prevent ref="item_form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="card_title_border">
                <v-row dense>
                  <v-col cols="8">
                    <CardTitle text="CONSULTA" sub />
                  </v-col>
                  <v-col cols="4" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <VisVal
                      lab="Folio"
                      :val="item.uiid"
                      :sub="item.created_at"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <VisVal
                      lab="Médico"
                      :val="item.doctor.full_name"
                      :sub="item.doctor.uiid"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <VisVal
                      lab="Paciente"
                      :val="item.patient.full_name"
                      :sub="
                        item.patient.uiid +
                        ' | Tel. ' +
                        item.patient.movil_phone
                      "
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title class="card_title_border">
                <v-row dense>
                  <v-col cols="8">
                    <CardTitle text="COBRO" sub />
                  </v-col>
                  <v-col cols="4" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" class="text-center">
                    <div
                      class="text-caption font-weight-bold"
                      v-text="'MONTO'"
                    />
                    <div
                      class="display-3 pb-4"
                      v-text="getAmountFormat(item.charge_amount)"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="E-mail del paciente"
                      v-model="item.patient.email"
                      dense
                      outlined
                      type="text"
                      :rules="rules.email"
                      maxlength="65"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Forma de pago"
                      v-model="item.fiscal_payment_id"
                      dense
                      outlined
                      :rules="rules.required"
                      :items="fiscal_payments"
                      :item-text="(v) => v.name + ' | ' + v.code"
                      item-value="id"
                      :loading="fiscal_payments_ldg"
                    />
                  </v-col>
                  <v-col cols="12" md="4" v-if="item.fiscal_payment_id == 3">
                    <v-text-field
                      label="Referencia"
                      v-model="item.charge_reference"
                      dense
                      outlined
                      :rules="rules.txt_rqd"
                      type="text"
                      maxlength="20"
                      counter
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    v-if="
                      item.fiscal_payment_id == 4 ||
                      item.fiscal_payment_id == 18
                    "
                  >
                    <v-text-field
                      label="Núm. aprobación"
                      v-model="item.charge_aprobattion"
                      dense
                      outlined
                      :rules="rules.txt_rqd"
                      type="text"
                      maxlength="10"
                      counter
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    v-if="
                      item.fiscal_payment_id == 4 ||
                      item.fiscal_payment_id == 18
                    "
                  >
                    <v-text-field
                      label="Tarjeta (4 últ. dig.)"
                      v-model="item.charge_card"
                      dense
                      outlined
                      :rules="rules.txt_rqd"
                      type="text"
                      maxlength="4"
                      counter
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-divider />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      label="¿Requiere factura fiscal?"
                      v-model="item.bill_patient"
                      dense
                      outlined
                      :rules="[(v) => v != null || 'Campo requerido']"
                      :items="bill_patient_opts"
                      :item-text="(v) => v.name"
                      item-value="id"
                    />
                  </v-col>
                  <v-col cols="12" v-if="item.bill_patient">
                    <v-row dense>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="RFC"
                          v-model="item.fiscal_code"
                          dense
                          outlined
                          :rules="rules.fiscal_code_rqd"
                          type="text"
                          maxlength="13"
                          counter
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Nombre | Razón social"
                          v-model="item.fiscal_name"
                          dense
                          outlined
                          :rules="rules.txt_rqd"
                          type="text"
                          maxlength="75"
                          counter
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="CP"
                          v-model="item.fiscal_zip"
                          dense
                          outlined
                          :rules="rules.zip_rqd"
                          type="text"
                          maxlength="5"
                          counter
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          label="Tipo Fiscal"
                          v-model="item.fiscal_type_id"
                          dense
                          outlined
                          :rules="rules.rqd"
                          :items="fiscal_types"
                          :item-text="(v) => v.name"
                          item-value="id"
                          :loading="fiscal_types_ldg"
                          @change="getFiscalRegimes()"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          label="Régimen Fiscal"
                          v-model="item.fiscal_regime_id"
                          dense
                          outlined
                          :rules="rules.rqd"
                          :items="fiscal_regimes"
                          :item-text="(v) => v.name + ' | ' + v.code"
                          item-value="id"
                          :loading="fiscal_regimes_ldg"
                          @change="getFiscalUses()"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-autocomplete
                          label="Uso CFDI"
                          v-model="item.fiscal_use_id"
                          dense
                          outlined
                          :rules="rules.rqd"
                          :items="fiscal_uses"
                          :item-text="(v) => v.name + ' | ' + v.code"
                          item-value="id"
                          :loading="fiscal_uses_ldg"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-divider />
                  </v-col>
                  <v-col cols="12">
                    <!-- Cambiar en electron por cámara abierta -->
                    <v-file-input
                      v-model="item.charge_proof_doc"
                      label="Comprobante"
                      dense
                      outlined
                      :rules="rules.docLmt"
                      show-size
                      prepend-icon=""
                      accept=".jpg"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <div class="text-right">
              <v-btn
                block
                small
                color="success"
                :loading="ldg"
                @click.prevent="update"
              >
                Aceptar
                <v-icon small right> mdi-account-cash </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  URL_API,
  getHdrs,
  getRsp,
  getErr,
  getRules,
  getObj,
  getFormData,
  getAmountFormat,
} from "@/general";
import Axios from "axios";
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import VisVal from "@/components/VisVal.vue";

export default {
  components: {
    BtnBack,
    CardTitle,
    BtnTheme,
    VisVal,
  },

  data() {
    return {
      route: "module/consultations",
      id: this.$window.atob(this.$route.params.id),
      auth: this.$store.getters.getAuth,
      ldg: true,
      item: null,
      rules: getRules(),
      //CATALOGS
      fiscal_payments: [],
      fiscal_payments_ldg: false,
      bill_patient_opts: [],
      fiscal_types: [],
      fiscal_types_ldg: false,
      fiscal_regimes: [],
      fiscal_regimes_ldg: false,
      fiscal_uses: [],
      fiscal_uses_ldg: false,
      //OTHERS
      getAmountFormat: getAmountFormat,
    };
  },
  methods: {
    getCatalogs() {
      Axios.get(URL_API + "/module/fiscal_payments", getHdrs(this.auth.token))
        .then((rsp) => {
          rsp = getRsp(rsp);
          this.fiscal_payments = rsp.data.items;
          this.fiscal_payments_ldg = false;
        })
        .catch((err) => {
          this.$root.$alert("error", getErr(err));
          this.fiscal_payments_ldg = false;
        });

      Axios.get(URL_API + "/module/fiscal_types", getHdrs(this.auth.token))
        .then((rsp) => {
          rsp = getRsp(rsp);
          this.fiscal_types = rsp.data.items;
          this.fiscal_types_ldg = false;
        })
        .catch((err) => {
          this.$root.$alert("error", getErr(err));
          this.fiscal_types_ldg = false;
        });
    },
    getItem() {
      Axios.get(
        URL_API + "/" + this.route + "/" + this.id,
        getHdrs(this.auth.token)
      )
        .then((rsp) => {
          rsp = getRsp(rsp);
          this.item = rsp.data.item;

          if (!this.item.charged_at) {
            if (!this.item.patient.fiscal_name) {
              this.item.fiscal_name = this.item.patient.full_name;
            }
          }

          this.getFiscalRegimes(true);
          this.getFiscalUses(true);

          this.ldg = false;
        })
        .catch((err) => {
          this.$root.$alert("error", getErr(err));
        });
    },
    update() {
      if (this.$refs.item_form.validate()) {
        this.$root
          .$confirm("¿Confirma el cobro de la consulta?")
          .then((confirm) => {
            if (confirm) {
              this.ldg = true;
              let obj = getObj(this.item, true);

              Axios.post(
                URL_API + "/" + this.route,
                getFormData(obj),
                getHdrs(this.auth.token, true)
              )
                .then((rsp) => {
                  rsp = getRsp(rsp);
                  this.$root.$alert("success", rsp.msg);
                  this.$router.push({ name: this.route });
                  this.ldg = false;
                })
                .catch((err) => {
                  this.$root.$alert("error", getErr(err));
                  this.ldg = false;
                });
            }
          });
      } else {
        this.$root.$alert("error", "Revisa los detalles señalados");
      }
    },
    getFiscalRegimes(is_mounted = false) {
      if (!is_mounted) {
        this.item.fiscal_regime_id = null;
        this.item.fiscal_use_id = null;
      }

      this.fiscal_regimes = [];
      this.fiscal_regimes_ldg = true;

      Axios.get(
        URL_API +
          "/module/fiscal_regimes?fiscal_type_id=" +
          this.item.fiscal_type_id,
        getHdrs(this.auth.token)
      )
        .then((rsp) => {
          rsp = getRsp(rsp);
          this.fiscal_regimes = rsp.data.items;
          this.fiscal_regimes_ldg = false;
        })
        .catch((err) => {
          this.$root.$alert("error", getErr(err));
          this.fiscal_regimes_ldg = false;
        });
    },
    getFiscalUses(is_mounted = false) {
      if (!is_mounted) {
        this.item.fiscal_use_id = null;
      }

      Axios.get(
        URL_API +
          "/module/fiscal_uses" +
          "?fiscal_regime_id=" +
          this.item.fiscal_regime_id,
        getHdrs(this.auth.token)
      )
        .then((rsp) => {
          rsp = getRsp(rsp);
          this.fiscal_uses = rsp.data.items;
          this.fiscal_uses_ldg = false;
        })
        .catch((err) => {
          this.$root.$alert("error", getErr(err));
          this.fiscal_uses_ldg = false;
        });
    },
  },
  mounted() {
    this.bill_patient_opts = [
      {
        id: 0,
        name: "NO",
      },
      {
        id: 1,
        name: "SI",
      },
      {
        id: null,
        name: "-",
      },
    ];
    this.getCatalogs();
    this.getItem();
  },
};
</script>
