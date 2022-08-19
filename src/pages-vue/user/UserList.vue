<template>
  <div>
    <h3 class="fw-600 margin-bottom-16">Manage user data</h3>
    <div class="text-grayest margin-bottom-24">All the data here are stored on mockapi.io, so shout out to them for providing such a cool service!</div>
    <template v-if="!loading">
      <div class="relative bg-white rounded-8 shadow-1 padding-24 margin-bottom-16">
        <div class="flex flex-justify-start flex-items-center">
          <div class="margin-right-16">
            <input type="text"
              class="form-text border-none bg-lightest padding-x-12 padding-y-4 fw-normal"
              placeholder="search name here.."
              v-model="search.name" />
          </div>
          <div class="margin-right-16">
            <input type="text"
              class="form-text border-none bg-lightest padding-x-12 padding-y-4 fw-normal"
              placeholder="search email here.."
              v-model="search.email" />
          </div>
        </div>
        <table class="table table-compact margin-y-20">
          <thead>
            <tr>
              <th class="th-shrink text-left">
                <div class="cursor-pointer flex flex-items-center">
                  <span class="margin-right-8"
                      @click="toggleSort('id')">
                    #
                  </span>
                  <span class="circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8" style="min-width: 32px;" 
                      @click="toggleSort('id')">
                    <i class="fa"
                      :class="[
                        sort.column === 'id' ? 'text-darkest' : 'text-gray',
                        sort.column === 'id' ?
                          (sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up') :
                          'fa-sort',
                      ]"></i>
                  </span>
                </div>
              </th>
              <th class="th-expand text-left">
                <div class="cursor-pointer flex flex-items-center">
                  <span class="margin-right-8"
                      @click="toggleSort('name')">
                    Name
                  </span>
                  <span class="circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8" style="min-width: 32px;" 
                      @click="toggleSort('name')">
                    <i class="fa fa-sort"
                      :class="[
                        sort.column === 'name' ? 'text-darkest' : 'text-gray',
                        sort.column === 'name' ?
                          (sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up') :
                          'fa-sort',
                      ]"></i>
                  </span>
                </div>
              </th>
              <th class="th-expand text-left">
                <div class="cursor-pointer flex flex-items-center">
                  <span class="margin-right-8"
                      @click="toggleSort('email')">
                    Email
                  </span>
                  <span class="circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8" style="min-width: 32px;" 
                      @click="toggleSort('email')">
                    <i class="fa"
                      :class="[
                        sort.column === 'email' ? 'text-darkest' : 'text-gray',
                        sort.column === 'email' ?
                          (sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up') :
                          'fa-sort',
                      ]"></i>
                  </span>
                </div>
              </th>
              <th class="th-shrink text-left">
                <div class="cursor-pointer flex flex-items-center">
                  <span class="margin-right-8"
                      @click="toggleSort('createdAt')">
                    Created at
                  </span>
                  <span class="circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8" style="min-width: 32px;" 
                      @click="toggleSort('createdAt')">
                    <i class="fa"
                      :class="[
                        sort.column === 'createdAt' ? 'text-darkest' : 'text-gray',
                        sort.column === 'createdAt' ?
                          (sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up') :
                          'fa-sort',
                      ]"></i>
                  </span>
                </div>
              </th>
              <th class="th-shrink text-left" colspan="2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in queryData" :key="index">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.email }}</td>
              <td>{{ new Date(row.createdAt).toLocaleDateString() }}</td>
              <td>
                <router-link class="a hover-text-light text-nowrap fw-400" :to="$url(`/user/update/${row.id}`)">Update <i class="fa fa-angle-right margin-left-4 fw-400"></i></router-link>
              </td>
              <td>
                <span class="bg-lightest hover-bg-light active-bg-gray padding-x-12 padding-y-4 fw-normal rounded-4 cursor-pointer">...</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="margin-bottom-20 margin-bottom-24-sm flex flex-justify-between flex-justify-center-sm flex-items-center">
        <div class="margin-right-16">
          <select v-model="table.totalDataPerPage"
              class="form-dropdown border-none bg-white padding-x- padding-y-4 fw-normal cursor-pointer">
            <option :value="5">5 rows</option>
            <option :value="10">10 rows</option>
            <option :value="25">25 rows</option>
          </select>
        </div>
        <div class="margin-right-auto fw-500 text-gray">
          {{ (table.currentPage - 1) * table.totalDataPerPage + 1 }} -
          <template v-if="table.currentPage >= totalPage">
            {{ filteredData.length }}
          </template>
          <template v-else>
            {{ (table.currentPage - 1) * table.totalDataPerPage + table.totalDataPerPage }}
          </template>
          of
          {{ filteredData.length }}
        </div>
        <div class="margin-left-8">
          <button class="button border-none bg-white hover-bg-light active-bg-gray padding-x-12 padding-y-4 fw-normal"
              :disabled="table.currentPage <= 1"
              @click="table.currentPage--">
            Prev
          </button>
          <template v-for="(row, index) in pageButtons">
            <button :key="`pageButtons-${index}`"
                class="button margin-x-4 border-none padding-y-4 fw-normal"
                :class="
                  row && row === table.currentPage ?
                    'bg-black text-white padding-x-12' :
                    (row > 0 ? 'bg-white hover-bg-light active-bg-gray padding-x-12' : 'padding-x-4')
                "
                :disabled="row < 0"
                @click="table.currentPage = row">
              {{ row > 0 ? row : "..." }}
            </button>
          </template>
          <button class="button border-none bg-white hover-bg-light active-bg-gray padding-x-12 padding-y-4 fw-normal"
              :disabled="table.currentPage >= totalPage"
              @click="table.currentPage++">
            Next
          </button>
        </div>
      </div>
    </template>
    <div v-else>
      <div class="bg-white rounded-8 shadow-1 padding-24 margin-bottom-16">
        <table class="table table-compact">
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
      <div class="margin-bottom-20 margin-bottom-24-sm flex flex-justify-between flex-justify-center-sm flex-items-center">
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
import api from '@/utils/api';
import queryData from '@/utils/queryData'

export default {
  name: 'UserList',
  data: function () {
    return {
      error: {
        object: null,
        title: '',
        message: '',
        showLoading: false,
      },
      loading: true,
      table: {
        data: null,
        totalDataPerPage: 5,
        currentPage: 1,
      },
      search: {
        name: '',
        email: '',
      },
      sort: {
        column: null,
        order: 'none', // 'ascending', 'descending'
      },
    };
  },
  async mounted () {
    this.fetchData();
  },
  computed: {
    filteredData: function () {
      return this.table.data &&
        queryData(this.table.data, {
          filterFunctions: (() => {
            let functions = [];
            if (this.search.name) {
              functions.push(row => row.name.match(this.search.name))
            }
            if (this.search.email) {
              functions.push(row => row.email.match(this.search.email))
            }
            return functions;
          })(),
        });
    },
    queryData: function () {
      return this.table.data &&
        queryData(this.table.data, {
          filterFunctions: (() => {
            let functions = [];
            if (this.search.name) {
              functions.push(row => row.name.match(this.search.name))
            }
            if (this.search.email) {
              functions.push(row => row.email.match(this.search.email))
            }
            return functions;
          })(),
          sortFunctions: (() => {
            let functions = [];
            if (this.sort.column) {
              functions.push((row1, row2) =>
                row1[this.sort.column] > row2[this.sort.column] &&
                this.sort.order === 'ascending' ?
                  1 : -1)
            }
            return functions;
          })(),
          totalDataPerPage: this.table.totalDataPerPage,
          currentPage: this.table.currentPage,
        });
    },
    pageButtons: function () {
      let first = 1,
          second = this.totalPage >= 2 ? 2 : null,
          third = this.totalPage >= 3 ? 3 : null,
          fourth = this.totalPage >= 4 ? 4 : null,
          fifth = this.totalPage >= 5 ? 5 : null;
      if (this.totalPage > 5) {
        if (this.table.currentPage <= 3) {
          fourth = -1;
          fifth = this.totalPage;
        } else if (this.table.currentPage > this.totalPage - 3) {
          second = -1;
          third = this.totalPage - 2;
          fourth = this.totalPage - 1;
          fifth = this.totalPage;
        } else {
          second = -1;
          third = this.table.currentPage;
          fourth = -1;
          fifth = this.totalPage;
        }
      }
      return [
        first,
        second,
        third,
        fourth,
        fifth,
      ].filter(Boolean);
    },
    totalPage: function () {
      console.log(this.filteredData)
      return this.filteredData ?
        Math.ceil(this.filteredData.length / this.table.totalDataPerPage) :
        0;
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
          // this.table.data = response.data.filter((data, index) => index < 23);
          // this.table.data = [...this.table.data, ...this.table.data];
          this.table.data = response.data;
          this.error = null;
          this.loading = false;
        }.bind(this))
        .catch(this.handleError);
    },
    toggleSort (column) {
      let order = 'ascending';
      if (this.sort.column === column) {
        if (this.sort.order === 'none') {
          order = 'ascending';
        } else if (this.sort.order === 'ascending') {
          order = 'descending';
        } else {
          column = null;
          order = 'none';
        }
      }
      this.sort.column = column;
      this.sort.order = order;
    },
  },
}
</script>
