Component({
  //父组件向子组件传值,子组件在properties里直接接收
  //接收的属性值直接作为data中的私有变量使用即可
  properties: {
    info: {
      type: Object,
      value: {}
    },

  },

  data: {

  },

  methods: {
    handleLikeTap() {
      let tmp = this.properties.info
      this.triggerEvent('LikeTap', {
        state: (tmp.hasLike + 1) % 2,
        id: tmp.id
      })
    }

  }
})