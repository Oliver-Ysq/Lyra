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
  options: {
    multipleSlots: true // 允许组件中使用多个slot
  },
  methods: {
    handleStarTap() {
      let tmp = this.properties.info
      this.triggerEvent('StarTap', {
        state: (tmp.star + 1) % 2,
        id: tmp.id
      })
    },
    // handleDetailTap(event){
    //   console.log(event)
    //   this.triggerEvent('DetailTap')
    // }
    
  }
})