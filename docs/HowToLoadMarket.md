## 如何加载
### step1 识别标记
> 在所有来自组件市场的组件，统一都会有一个`{market:true}`的props值
```javascript
if(/*内置组件*/){
    // 直接加载
    // 按需引入
}

if(/*自定义组件*/){
    // 按需引入
}

if(/*组件市场*/){
    // ...
    // step2
}
```

### step2 获取js
这里会根据`组件名`去组件市场请求获取组件信息
```
GET
/data/component/detailByEnTitle?componentEnTitle=m-test
Content-Type: application/json

{
 "code":0,
 "data":{
    "createTime":1609318925000,
    "updateTime":1609385556000,
    "deleteTime":null,
    "componentId":"7b68acc1-aa22-400d-9238-15bfeaf4f7c0",
    "componentTitle":"示例组件",
    "componentImage":"https://cdn.shenzhepei.com/test/m-hello.png",
    "componentJsUrl":"https://cdn.shenzhepei.com/test/dvdp-expand-example.umd.min.js",
    "componentEnTitle":"m-test",
    "componentTypeId":1,
    "sort":9,
    "remark":null
  },
 "msg":"请求成功",
 "success":true
}
```
主要逻辑代码
```javascript
this.$api.bussiness.detailMarket({componentEnTitle: this.type}).then(res => {
    let script = document.createElement('script')
    script.onload = () => {
        // ...        
        // step3
    }
    script.src = res.componentJsUrl
    document.head.appendChild(script)
})
```

### step3 注册渲染组件
```javascript
Vue.component(`market-${res.componentEnTitle}`, window.GoldChart.components[res.componentEnTitle].component)
this.ready = true
```

