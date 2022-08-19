<template>
  <div class="height-100 flex flex-items-center flex-justify-center bg-lighter">
    <div class="padding-24 rounded border shadow bg-white" style="width: 400px;">
      <form>
        <div class="margin-bottom-24">
          <label class="form-label">Email</label>
          <input
            v-model="login.email"
            class="form-text"
            type="text"
          />
        </div>
        <div class="margin-bottom-24">
          <label class="form-label">Password</label>
          <input
            v-model="login.password"
            class="form-text"
            type="text"
          />
        </div>
        <div>
          <a class="button button-primary"
              :disabled="!canSubmit"
              @click="submit">
            Login
          </a>
        </div>
      </form>
      <loading v-if="loading.submit"></loading>
      <error v-if="error.title"
        :title="error.title"
        :message="error.message"
        :showLoading="error.showLoading"
        :inlineDisplay="false"></error>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api';
import auth from '@/utils/auth';
import handleError from '@/utils/handleError';
import Error from '@/components-vue/Error';
import Loading from '@/components-vue/Loading';

export default {
  name: 'Login',
  components: { error: Error, loading: Loading },
  data: () => {
    return {
      error: {
        object: null,
        title: '',
        message: '',
        showLoading: false,
      },
      loading: {
        submit: false,
      },
      login: {
        email: '',
        password: '',
      },
      errorMessage: 'Email or password is incorrect, please try with the correct one',
      validationState: null,
    };
  },
  computed: {
    canSubmit: function () {
      return this.login.email && this.login.password;
    },
  },
  methods: {
    submit: function () {
      this.loading.submit = true;

      const catchError = function (error) {
        if (error) {
          this.error.object = error;
          [this.error.title, this.error.message, this.error.showLoading] = handleError(error);
        }
        this.loading.submit = false;
      }

      auth.login(this.login.email, this.login.password)
        .then(response => {
          this.loading.submit = false;
          this.$router.go(-1);
        })
        .catch(catchError.bind(this));
    },
  },
}
</script>
