import * as React from 'react';

import api from '@/utils/api'
import handleError from '@/utils/handleError'
import { debounceValidation } from '@/utils/debounce'
import { isValidEmail } from '@/utils/regex'
import Error from '@/components-react/Error'
import Loading from '@/components-react/Loading'

export default function UserList({ id = null }) {
  const isMounted = React.useRef(false);

  // data
  const [data, setData] = React.useState({
    error: {
      object: null,
      title: '',
      message: '',
      showLoading: false,
    },
    loading: {
      fetchData: false,
      submit: false,
    },
    user: {
      name: '',
      email: '',
    },
    errorMessages: {
      email: {
        isValidEmail: 'Invalid email format',
        isNotBlank: 'Field can\'t be empty',
      },
      name: {
        isNotBlank: 'Field can\'t be empty',
      },
    },
    validationStates: {
      email: {
        isValidEmail: null,
        isNotBlank: null,
      },
      name: {
        isNotBlank: null,
      },
    },
  });

  // watch
  React.useEffect(() => {
    isMounted.current && setData(prevData => (validateName(), { ...prevData }))
  }, [data.user.name])

  React.useEffect(() => {
    isMounted.current && setData(prevData => (validateEmail(), { ...prevData }))
  }, [data.user.email])

  // mounted
  React.useEffect(() => {
    isMounted.current = true;
  }, []);

  // methods
  function fetchData () {
    data.loading.fetchData = true;

    const catchError = function (error) {
      if (error) {
        data.error.object = error;
        [data.error.title, data.error.message, data.error.showLoading] = handleError(error);
      }
      data.loading.fetchData = false;
    }

    api.retry({ beforeRetry: catchError })
      .get("users")
      .then(function (response) {
        data.user = response.data.map(function(user) {
          return user;
        });

        data.error = null;
        data.loading.fetchData = false;
      })
      .catch(catchError);
  };

  function submit () {
    setData((prevData) => (
      prevData.loading.submit = true,
      { ...prevData }
    ))

    const catchError = function (error) {
      // todo: doesn't support disconnected internet
      // console.log('y', error)
      if (error) {
        setData((prevData) => (
          prevData.error.object = error,
          { ...prevData }
        ))

        const [title, message, showLoading] = handleError(error);
        setData((prevData) => (
          prevData.error.title = title,
          { ...prevData }
        ))
        setData((prevData) => (
          prevData.error.message = message,
          { ...prevData }
        ))
        setData((prevData) => (
          prevData.error.showLoading = showLoading,
          { ...prevData }
        ))
      }
      setData((prevData) => (
        prevData.loading.submit = false,
        { ...prevData }
      ))
    }

    api.retry({ beforeRetry: catchError })
      .post("users", data.user)
      .then(function (response) {
        // console.log('submitted')
        setData((prevData) => (
          prevData.error = null,
          { ...prevData }
        ))
        setData((prevData) => (
          prevData.loading.submit = false,
          { ...prevData }
        ))
      })
      .catch(catchError);
  };

  function validateEmail (event = null) {
    // isValidEmail
    if (data.user.email) {
      if (event && event.type === 'blur') {
        setData((prevData) => (
          prevData.validationStates.email.isValidEmail =
            isValidEmail.test(String(prevData.user.email).toLowerCase()),
          { ...prevData }
        ))
      } else {
        setData((prevData) => (
          prevData.validationStates.email.isValidEmail =
            isValidEmail.test(String(prevData.user.email).toLowerCase()) ?
              true : null,
          { ...prevData }
        ))
        // _.debounce can't be called directly here
        // looks like it's not 1 instance if not wrapped like this
        debounceValidation(function() {
          setData((prevData) => (
            prevData.validationStates.email.isValidEmail =
              isValidEmail.test(String(prevData.user.email).toLowerCase()),
            { ...prevData }
          ))
        })
      }
    } else {
      setData((prevData) => (
        prevData.validationStates.email.isValidEmail = null,
        { ...prevData }
      ))
    }

    // isNotBlank
    setData((prevData) => (
      prevData.validationStates.email.isNotBlank = !!prevData.user.email,
      { ...prevData }
    ))
  };

  function validateName () {
    // isNotBlank
    setData((prevData) => (
      prevData.validationStates.name.isNotBlank = !!prevData.user.name,
      { ...prevData }
    ))
  };

  // computed
  function canSubmit () {
    return Object.values(data.validationStates.email).every((value) => value ) &&
      Object.values(data.validationStates.name).every((value) => value );
  };

  return (
    <>{(() => {
      if (!data.loading.fetchData) return (
        <div className="relative">
          <div className={`margin-bottom-24
                ${Object.values(data.validationStates.name).includes(false) ? 'has-error' : ''}
              `}>
            <label className="form-label">Name</label>
            <input type="text" className="form-text"
              onBlur={e => validateName(e)}
              onChange={e => {
                const newValue = e.target.value;
                setData((prevData) => (prevData.user.name = newValue, { ...prevData }))
              }} />
          </div>
          <div className={`margin-bottom-24
                ${Object.values(data.validationStates.email).includes(false) ? 'has-error' : ''}
              `}>
            <label className="form-label">Email</label>
            <input type="text" className="form-text"
              onBlur={e => validateEmail(e)}
              onChange={e => {
                const newValue = e.target.value;
                setData((prevData) => (prevData.user.email = newValue, { ...prevData }))
              }} />
          </div>
          <div className="margin-bottom-24">
            <button className="button button-primary"
                disabled={!canSubmit()}
                onClick={submit}>
              Submit
            </button>
          </div>
          {(() => {
            if (data.error.title) return (
              <Error title={data.error.title}
                message={data.error.message}
                showLoading={data.error.showLoading}
                inlineDisplay={false} />
            )
            if (data.loading.submit) return (
              <Loading />
            )
          })()}
        </div>
      )
      else return (
        <div class="margin-bottom-20 flex flex-justify-between">
          <div>
            <div class="skeleton rounded-4 width-96px height-24px"></div>
          </div>
          <div class="hidden-sm flex flex-items-center">
            <div class="skeleton rounded-4 margin-left-12 height-24px width-28px"></div>
            <div class="skeleton rounded-4 margin-left-12 height-36px width-32px"></div>
            <div class="skeleton rounded-4 margin-left-12 height-24px width-76px"></div>
          </div>
        </div>
      )
    })()}</>
  );
}

// const a = {
//   async mounted () {
//     if (this.id) this.fetchData()
//   },
// }
