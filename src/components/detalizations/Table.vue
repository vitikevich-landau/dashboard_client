<template>
  <div class="table-responsive pt-3 detalizations">
    <table class="table table-sm table-fixed">
      <thead>
      <tr>
        <th>Учреждение</th>
        <th>Район</th>
        <th v-for="acc in filterAccounts" :key="acc">{{ acc }}</th>
        <th>Всего</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="v in grouped" :key="v[0]">
        <td>{{ v[0] }}</td>
        <td>{{ v[1] }}</td>
        <td v-for="acc in filterAccounts" :key="acc">
          {{ amounts(v[2][acc]) | toCurrency }}
        </td>
        <td>{{ v[2]['total'] | toCurrency }}</td>
      </tr>
      </tbody>
    </table>
    <!--    {{ byInstitution }}-->
  </div>
</template>

<script>
  import store from '@/store';
  // eslint-disable-next-line no-unused-vars
  import _ from 'lodash';
  import { mapGetters } from 'vuex';
  import { toLocalCurrency } from "@/utils/currency";

  export default {
    name: "Table",
    store,
    props: ['items'],
    data() {
      return {};
    },
    computed: {
      ...mapGetters(['filterAccounts']),
      grouped() {
        const res = this.items.groupBy(['institution', 'district', 'account']);

        const details = [];

        for (const i in res) {
          for (const d in res[i]) {
            // const accs = [];
            const accs = {total: 0};

            for (const a in res[i][d]) {
              // console.log(res[i][d][a].map(v => v.amount));
              // accs.push([a, res[i][d][a].map(v => v.amount)]);
              let amounts = res[i][d][a].map(v => v.amount);
              accs[a] = {
                amounts,
                total: amounts.reduce((acc, c) => acc + c, 0)
              };
              accs.total += amounts.reduce((acc, c) => acc + c, 0);
            }

            /*
            *   Break Point Here
            * */

            // console.log(accs);

            details.push([i, d, accs]);

            // console.log([i, d, accs]);
          }
        }

        // console.log(details);

        return details;
      },
    },
    filters: {
      toCurrency(amount) {
        return toLocalCurrency(amount);
      }
    },
    methods: {
      amounts(acc) {
        return acc ? acc['amounts'].reduce((acc, c) => acc + c, 0) : 0;
      },
    }
  }
</script>

<style scoped>
  .detalizations {
    height: 350px;
  }
</style>