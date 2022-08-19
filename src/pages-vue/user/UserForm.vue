<template>
  <div>
    <h3 class="fw-600 margin-bottom-16">
      <template v-if="id">
        Edit user data
      </template>
      <template v-else>
        Submit user data
      </template>
    </h3>
    <div class="text-grayest margin-bottom-24">Data is stored on mockapi.io, so shout out to them for providing such a cool service!</div>
    <div class="relative bg-white rounded-8 shadow-1 padding-24 margin-bottom-16">
      <!-- loaded content -->
      <div class="margin-bottom-24"
          :class="{
            'has-error': Object.values(this.validationStates.name).includes(false),
          }">
        <label class="form-label">Name</label>
        <input v-model="user.name"
          class="form-text"
          type="text"
          @blur="validateName($event)">
      </div>
      <div class="margin-bottom-24"
          :class="{
            'has-error':
              Object.values(this.validationStates.email).includes(false),
          }">
        <label class="form-label">Email</label>
        <input v-model="user.email"
          class="form-text"
          type="text"
          @blur="validateEmail($event)">
      </div>
      <div class="margin-bottom-24"
          :class="{
            'has-error':
              Object.values(this.validationStates.password).includes(false),
          }">
        <label class="form-label">Password</label>
        <input v-model="user.password"
          class="form-text"
          type="password"
          @blur="validatePassword($event)">
      </div>
      <div class="margin-bottom-12">
        <button class="button button-primary"
            :disabled="!canSubmit"
            @click="submit">
          Submit
        </button>
      </div>
      <!-- skeleton -->
      <div v-if="loading.fetchData"
          class="absolute width-100 height-100 top-0 left-0 bg-white padding-24">
        <div class="margin-bottom-24">
          <div class="skeleton rounded-4 width-60px height-24px margin-bottom-12"></div>
          <div class="skeleton rounded-4 width-100 height-40px"></div>
        </div>
        <div class="margin-bottom-24">
          <div class="skeleton rounded-4 width-60px height-24px margin-bottom-12"></div>
          <div class="skeleton rounded-4 width-100 height-40px"></div>
        </div>
        <div class="margin-bottom-24">
          <div class="skeleton rounded-4 width-60px height-24px margin-bottom-12"></div>
          <div class="skeleton rounded-4 width-100 height-40px"></div>
        </div>
        <div class="margin-bottom-12">
          <div class="skeleton rounded-4 width-96px height-40px"></div>
        </div>
      </div>
      <!-- loading indicator when submitting -->
      <loading v-if="loading.submit"></loading>
      <!-- error message -->
      <error v-if="error.title"
        :title="error.title"
        :message="error.message"
        :showLoading="error.showLoading"
        :inlineDisplay="false"></error>
    </div>
  </div>
</template>

<script>
import api from '../../utils/api'
import handleError from '../../utils/handleError'
import toast from '../../utils/toast'
import { debounceValidation } from '../../utils/debounce'
import { isValidEmail } from '../../utils/regex'
import Error from '../../components-vue/Error'
import Loading from '../../components-vue/Loading'

export default {
  name: 'UserForm',
  components: { error: Error, loading: Loading },
  data: () => {
    return {
      error: {
        object: null,
        title: "",
        message: "",
        showLoading: false,
      },
      loading: {
        fetchData: false,
        submit: false,
      },
      id: null,
      user: {
        name: "",
        email: "",
        password: "",
      },
      errorMessages: {
        name: {
          isNotBlank: 'Field can\'t be empty',
        },
        email: {
          isValidEmail: 'Invalid email format',
          isNotBlank: 'Field can\'t be empty',
        },
        password: {
          isNotBlank: 'Field can\'t be empty',
        },
      },
      validationStates: {
        name: {
          isNotBlank: null,
        },
        email: {
          isValidEmail: null,
          isNotBlank: null,
        },
        password: {
          isNotBlank: null,
        },
      },
      state: {
        enableValidationOnWatch: true,
      },
    };
  },
  async mounted () {
    this.id = this.$route.params.id;
    if (this.id) {
      this.fetchData();
    }
  },
  computed: {
    canSubmit: function () {
      return Object.values(this.validationStates.name).every((value) => value ) &&
        Object.values(this.validationStates.email).every((value) => value ) &&
        Object.values(this.validationStates.password).every((value) => value );
    },
  },
  methods: {
    fetchData: function () {
      this.loading.fetchData = true;

      const catchError = function (error) {
        if (error) {
          this.error.object = error;
          [
            this.error.title,
            this.error.message, 
            this.error.showLoading,
          ] = handleError(error);
        }
        this.loading.fetchData = false;
      }

      api.retry({ beforeRetry: catchError })
        .get(`users/${this.id}`)
        .then(function (response) {
          this.user = response.data;

          this.error.object = null;
          this.loading.fetchData = false;
        }.bind(this))
        .catch(catchError.bind(this));
    },
    resetForm: function () {
      this.state.enableValidationOnWatch = false;
      this.user.name = "";
      this.user.email = "";
      this.user.password = "";
      this.validationStates.name.isNotBlank = null;
      this.validationStates.email.isValidEmail = null;
      this.validationStates.email.isNotBlank = null;
      this.validationStates.password.isNotBlank = null;
      _.debounce(function () {
        this.state.enableValidationOnWatch = true;
      }.bind(this), 100)();
    },
    submit: function () {
      this.loading.submit = true;

      const catchError = function (error) {
        // todo: doesn't support disconnected internet
        if (error) {
          this.error.object = error;
          [
            this.error.title,
            this.error.message, 
            this.error.showLoading,
          ] = handleError(error);
        }
        this.loading.submit = false;
      }

      if (this.id) {
        api.retry({ beforeRetry: catchError })
          .put(`users/${this.id}`, this.user)
          .then(function (response) {
            this.error.object = null;
            this.loading.submit = false;
            toast.show("User is edited", "You can check updated user on User list page");
          }.bind(this))
          .catch(catchError.bind(this));
      } else{
        api.retry({ beforeRetry: catchError })
          .post("users", this.user)
          .then(function (response) {
            this.error.object = null;
            this.loading.submit = false;
            toast.show("User is added", "You can check added user on User list page");
            this.resetForm();
          }.bind(this))
          .catch(catchError.bind(this));
      }
    },
    validateEmail: function ($event = null) {
      // isValidEmail
      if (this.user.email) {
        if ($event && $event.type === 'blur') {
          this.validationStates.email.isValidEmail =
            isValidEmail.test(String(this.user.email).toLowerCase());
        } else {
          this.validationStates.email.isValidEmail =
            isValidEmail.test(String(this.user.email).toLowerCase()) ?
              true : null;
          // _.debounce can't be called directly here
          // looks like it's not 1 instance if not wrapped like this
          debounceValidation(function() {
            this.validationStates.email.isValidEmail =
              isValidEmail.test(String(this.user.email).toLowerCase());
          }.bind(this));
        }
      } else {
        this.validationStates.email.isValidEmail = null;
      }

      // isNotBlank
      this.validationStates.email.isNotBlank = !!this.user.email;
    },
    validateName: function () {
      // isNotBlank
      this.validationStates.name.isNotBlank = !!this.user.name;
    },
    validatePassword: function () {
      // isNotBlank
      this.validationStates.password.isNotBlank = !!this.user.password;
    },
  },
  watch: {
    "$route": function () {
      this.id = this.$route.params.id;
      if (this.id) {
        this.fetchData();
      } else {
        this.resetForm();
      }
    },
    "user.name": function () {
      this.state.enableValidationOnWatch && this.validateName();
    },
    "user.email": function () {
      this.state.enableValidationOnWatch && this.validateEmail();
    },
    "user.password": function () {
      this.state.enableValidationOnWatch && this.validatePassword();
    },
  },
}
</script>
