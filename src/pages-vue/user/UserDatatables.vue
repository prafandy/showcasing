<template>
  <div>
    <h3 class="fw-600 margin-bottom-16">Manage user data</h3>
    <div class="text-grayest margin-bottom-24">All the data here are stored on mockapi.io, so shout out to them for providing such a cool service!</div>
    <datatable v-if="!loading" class="table table-compact"
      :columns="table.columns"
      :data="table.data"
      :options="table.options"
      :page-length="table.pageLength"
      @draw="everyDraw">
    </datatable>
    <div v-else>
      <div class="bg-white rounded-8 shadow-1 padding-24 margin-bottom-16">
        <table class="table table-compact dataTable no-footer" style="" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info" role="grid">
          <thead>
            <tr role="row">
              <th class="th-shrink"><span class="skeleton rounded-4 height-24px width-32px"></span></th>
              <th class="th-expand"><span class="skeleton rounded-4 height-24px width-96px"></span></th>
              <th class="th-shrink"><span class="skeleton rounded-4 height-24px width-96px"></span></th>
              <th class="th-shrink"><span class="skeleton rounded-4 height-24px width-96px"></span></th>
              <th class="th-shrink"><span class="skeleton rounded-4 height-24px width-96px"></span></th>
              <th class="th-shrink"><span class="skeleton rounded-4 height-24px width-96px"></span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in [0, 1, 2, 3]" :key="i">
              <td class="th-shrink"><span class="skeleton rounded-4 height-24px width-24px"></span></td>
              <td class="th-expand"><span class="skeleton rounded-4 height-24px" :style="{width: `${Math.floor(Math.random() * (400 - 140 + 1) + 140)}px`}"></span></td>
              <td class="th-shrink"><span class="skeleton rounded-4 height-24px width-60px"></span></td>
              <td class="th-shrink"><span class="skeleton rounded-4 height-24px width-60px"></span></td>
              <td class="th-shrink"><span class="skeleton rounded-4 height-24px width-60px"></span></td>
              <td class="th-shrink"><span class="skeleton rounded-4 height-24px width-60px"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="margin-bottom-20 margin-bottom-24-sm flex flex-justify-between flex-justify-center-sm">
        <div>
          <div class="skeleton rounded-4 width-96px height-24px"></div>
        </div>
        <div class="hidden-sm flex flex-items-center">
          <div class="skeleton rounded-4 margin-left-12 height-24px width-28px"></div>
          <div class="skeleton rounded-4 margin-left-12 height-36px width-32px"></div>
          <div class="skeleton rounded-4 margin-left-12 height-24px width-76px"></div>
        </div>
      </div>
      <div class="hidden-sm-greater flex flex-justify-between">
        <div class="skeleton rounded-4 height-40px fill margin-right-8"></div>
        <div class="skeleton rounded-4 height-40px fill margin-left-8"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import api from '@/utils/api';
import toast from '@/utils/toast';

import Datatables from '@/components-vue/Datatables';

export default {
  name: 'UserDatatables',
  components: { datatable: Datatables },
  data: () => {
    return {
      error: null,
      loading: false,
      table: {
        columns: null,
        data: null,
        options: {},
        pageInfo: null,
        pageLength: 5,
      },
    };
  },
  async mounted () {
    this.fetchData();
  },
  computed: {
    tableColumns: function () {
      return [
        {
          data: function (data) {
            return data.id;
          },
          title: "<span class='fw-600'>#</span>",
          className: "th-shrink",
          render: function (value, type, data) {
            return `${value}`;
          }.bind(this),
        },
        { data: "name", title: "Name", className: "text-left th-expand" },
        { data: "email", title: "Email", className: "text-left th-expand" },
        { data: "password", title: "Password", className: "th-shrink",
          render: function (value, type, data) {
            return `<span class="text-nowrap">${value}</span>`;
          }.bind(this),
        },
      ].filter(Boolean);
    },
  },
  methods: {
    fetchData () {
      this.loading = true;

      const handleError = (error) => {
        this.error = error;
        this.loading = false;
      }

      api.retry({ beforeRetry: handleError })
        .get("users")
        .then(function (response) {
          this.table.columns = this.tableColumns;
          this.table.data = response.data.map(function(user) {
            return user;
          }.bind(this));
          this.table.options = {
            createdRow: function(trEl, data) {
              var $trEl = $(trEl);
              // console.log("createdRow: ")
              // console.log("$trEl: ", $trEl)
              // console.log("data: ", data)
            }.bind(this),
          };

          this.error = null;
          this.loading = false;
        }.bind(this))
        .catch(this.handleError);
    },
    everyDraw: function (e) {
      this.table.pageInfo = e.pageInfo;
    },
  },
  watch: {
    $props: {
      deep: true,
      handler: function () {
        this.fetchData();
      },
    },
  },
}
</script>
