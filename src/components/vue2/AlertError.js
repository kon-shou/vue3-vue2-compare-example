export const AlertErrorMixin = {
  data() {
    return {
      latestError: ''
    }
  },
  methods: {
    alertError(error) {
      this.latestError = error
      if (error !== '') {
        window.alert(error)
      }
    }
  }
}
