import React from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@/utils/api'
import handleError from '@/utils/handleError'
import i18next from '@/utils/i18next';
import queryData from '@/utils/queryData'
import url from '@/utils/url'

export default function UserList() {
  let t = i18next.t;
  let navigate = useNavigate();

  const isMounted = React.useRef(false);

  // data
  const [data, setData] = React.useState({
    error: {
      object: null,
      title: '',
      message: '',
      showLoading: false,
    },
    loading: false,
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
  });

  // mounted
  React.useEffect(() => {
    isMounted.current = true;

    fetchData();
  }, []);

  // computed
  function totalPage () {
    return data.table.data ?
      Math.ceil(data.table.data.length / data.table.totalDataPerPage)
      : 0;
  }

  // methods
  function toggleSort (column) {
    let order = 'ascending';
    if (data.sort.column === column) {
      if (data.sort.order === 'none') {
        order = 'ascending';
      } else if (data.sort.order === 'ascending') {
        order = 'descending';
      } else {
        column = null;
        order = 'none';
      }
    }
    setData((prevData) => (
      prevData.sort.column = column,
      prevData.sort.order = order,
      { ...prevData }
    ))
  }

  function fetchData () {
    setData((prevData) => (
      prevData.loading = true,
      { ...prevData }
    ))

    const catchError = function (error) {
      if (error) {
        const [title, message, showLoading] = handleError(error);
        setData((prevData) => (
          prevData.error.object = error,
          prevData.error.title = title,
          prevData.error.message = message,
          prevData.error.showLoading = showLoading,
          { ...prevData }
        ))
      }
      setData((prevData) => (
        prevData.loading = false,
        { ...prevData }
      ))
    }

    api.retry({ beforeRetry: handleError })
      .get("users")
      .then(function (response) {
        setData((prevData) => (
          prevData.table.data = response.data.map((user, index) => (user.index = index, user)),
          prevData.error = null,
          prevData.loading = false,
          { ...prevData }
        ))
      })
      .catch(catchError);
  };

  return (
    <div>
      <div>
        active lang: {i18next.language}
      </div>
      <div>
        usage example: {t('components.errors.networkError.title')}
      </div>
      <div>
        available langs:
        {
          i18next.options.supportedLngs.slice(0, -1).map((lang, index) => (
            <span className="margin-left-4 cursor-pointer" key={index}
                onClick={e => {
                  navigate(url(null, lang));
                  // how the fuck i18next doesn't change the active lang
                  // when we've told its setting to read from first url path
                  // that's why we need this line
                  i18next.changeLanguage(lang);
                }}>
              {lang} ({url(null, lang)})
            </span>
          ))
        }
      </div>
      <table className="table table-compact">
        <thead>
          <tr>
            <th className="th-shrink text-left">
              <div className="cursor-pointer flex flex-items-center">
                <span className="margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('id'), { ...prevData }))}>
                  #
                </span>
                <span className="circle bg-lightest active-bg-light width-32px height-32px flex flex-items-center flex-justify-center margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('id'), { ...prevData }))}>
                  <i className={`fa
                    ${data.sort.column === 'id' ? 'text-darkest' : 'text-gray'}
                    ${
                      data.sort.column === 'id' ?
                        data.sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up' :
                        'fa-sort'
                    }
                  `}></i>
                </span>
              </div>
            </th>
            <th className="th-expand text-left">
              <div className="cursor-pointer flex flex-items-center">
                <span className="margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('name'), { ...prevData }))}>
                  Name
                </span>
                <span className="circle bg-lightest active-bg-light width-32px height-32px flex flex-items-center flex-justify-center margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('name'), { ...prevData }))}>
                  <i className={`fa
                    ${data.sort.column === 'name' ? 'text-darkest' : 'text-gray'}
                    ${
                      data.sort.column === 'name' ?
                        data.sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up' :
                        'fa-sort'
                    }
                  `}></i>
                </span>
                <input type="text"
                  className="form-text border-none padding-y-4 bg-lightest width-auto"
                  placeholder="search name here.."
                  onChange={e => {
                    const newValue = e.target.value;
                    setData((prevData) => (prevData.search.name = newValue, { ...prevData }))
                  }} />
              </div>
            </th>
            <th className="th-expand text-left">
              <div className="cursor-pointer flex flex-items-center">
                <span className="margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('email'), { ...prevData }))}>
                  Email
                </span>
                <span className="circle bg-lightest active-bg-light width-32px height-32px flex flex-items-center flex-justify-center margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('email'), { ...prevData }))}>
                  <i className={`fa
                    ${data.sort.column === 'email' ? 'text-darkest' : 'text-gray'}
                    ${
                      data.sort.column === 'email' ?
                        data.sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up' :
                        'fa-sort'
                    }
                  `}></i>
                </span>
                <input type="text"
                  className="form-text border-none padding-y-4 bg-lightest width-auto"
                  placeholder="search email here.."
                  onChange={e => {
                    const newValue = e.target.value;
                    setData((prevData) => (prevData.search.email = newValue, { ...prevData }))
                  }} />
              </div>
            </th>
            <th className="th-shrink text-left">
              <div className="cursor-pointer flex flex-items-center">
                <span className="margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('createdAt'), { ...prevData }))}>
                  Created at
                </span>
                <span className="circle bg-lightest active-bg-light width-32px height-32px flex flex-items-center flex-justify-center margin-right-8"
                    onClick={e => setData((prevData) => (toggleSort('createdAt'), { ...prevData }))}>
                  <i className={`fa
                    ${data.sort.column === 'createdAt' ? 'text-darkest' : 'text-gray'}
                    ${
                      data.sort.column === 'createdAt' ?
                        data.sort.order === 'ascending' ? 'fa-sort-down' : 'fa-sort-up' :
                        'fa-sort'
                    }
                  `}></i>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            data.table.data &&
            queryData(data.table.data, {
              filterFunctions: (() => {
                let functions = [];
                if (data.search.name) {
                  functions.push(row => row.name.match(data.search.name))
                }
                if (data.search.email) {
                  functions.push(row => row.email.match(data.search.email))
                }
                return functions;
              })(),
              sortFunctions: (() => {
                let functions = [];
                if (data.sort.column) {
                  functions.push((row1, row2) =>
                    row1[data.sort.column] > row2[data.sort.column] &&
                    data.sort.order === 'ascending' ?
                      1 : -1)
                }
                return functions;
              })(),
              totalDataPerPage: data.table.totalDataPerPage,
              currentPage: data.table.currentPage,
            }).map((row, index) => (
              <tr key={index}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="flex flex-justify-end">
        <div className="relative margin-right-12">
          <div className="padding-x-12 padding-x-16 padding-y-4 bg-lightest rounded-4">5 rows</div>
          {/*<div className="dropdown dropdown-bottom border border-dark">
            Hello World!
          </div>*/}
        </div>
        <div className="margin-right-12">
          <select className="form-dropdown border-none padding-y-4 bg-lightest width-auto">
            <option>5 rows</option>
            <option>10 rows</option>
            <option>25 rows</option>
          </select>
        </div>
        <div>
          <button className="button margin-x-4 border-none bg-lightest padding-x-12 padding-y-4 fw-normal"
              disabled={data.table.currentPage <= 1}
              onClick={e => setData((prevData) => (prevData.table.currentPage--, { ...prevData }))}>
            Prev
          </button>
          {
            ((totalData, totalDataPerPage, currentPage) => {
              let second, third, fourth;
              if (currentPage <= 3) {
                second = 2;
                third = 3;
                fourth = null;
              } else if (currentPage > totalPage() - 3) {
                second = null;
                third = totalPage() - 2;
                fourth = totalPage() - 1;
              } else {
                second = null;
                third = currentPage;
                fourth = null;
              }
              return [1, second, third, fourth, totalPage()];
            })(data.table.data && data.table.data.length, data.table.totalDataPerPage, data.table.currentPage).map((row, index) => (
              <button key={index}
                  className={`button margin-x-4 border-none padding-y-4 fw-normal
                      ${row && row === data.table.currentPage ?
                        'bg-black text-white padding-x-12' :
                        row ? 'bg-lightest padding-x-12' : 'padding-x-4'
                      }
                    `}
                  disabled={!row}
                  onClick={e => setData((prevData) => (prevData.table.currentPage = row, { ...prevData }))}>
                { row ? row : '...'}
              </button>
            ))
          }
          <button className="button margin-x-4 border-none bg-lightest padding-x-12 padding-y-4 fw-normal"
              disabled={data.table.currentPage >= totalPage()}
              onClick={e => setData((prevData) => (prevData.table.currentPage++, { ...prevData }))}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
