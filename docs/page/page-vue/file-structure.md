### Vue 源码分析——目录结构

#### 目录结构

```js
├── build --------------------------------- 构建相关的文件，一般情况下我们不需要动
├── dist ---------------------------------- 构建后文件的输出目录
├── examples ------------------------------ 存放一些使用Vue开发的应用案例
├── flow ---------------------------------- 类型声明，使用开源项目 [Flow](https://flowtype.org/)
├── package.json -------------------------- 不解释
├── test ---------------------------------- 包含所有测试文件
├── src ----------------------------------- 这个是我们最应该关注的目录，包含了源码
│   ├── entries --------------------------- 包含了不同的构建或包的入口文件
│   │   ├── web-runtime.js ---------------- 运行时构建的入口，输出 dist/vue.common.js 文件，不包含模板(template)到render函数的编译器，所以不支持 `template` 选项，我们使用vue默认导出的就是这个运行时的版本。大家使用的时候要注意
│   │   ├── web-runtime-with-compiler.js -- 独立构建版本的入口，输出 dist/vue.js，它包含模板(template)到render函数的编译器
│   │   ├── web-compiler.js --------------- vue-template-compiler 包的入口文件
│   │   ├── web-server-renderer.js -------- vue-server-renderer 包的入口文件
│   ├── compiler -------------------------- 编译器代码的存放目录，将 template 编译为 render 函数
│   │   ├── parser ------------------------ 存放将模板字符串转换成元素抽象语法树的代码
│   │   ├── codegen ----------------------- 存放从抽象语法树(AST)生成render函数的代码
│   │   ├── optimizer.js ------------------ 分析静态树，优化vdom渲染
│   ├── core ------------------------------ 存放通用的，平台无关的代码
│   │   ├── observer ---------------------- 反应系统，包含数据观测的核心代码
│   │   ├── vdom -------------------------- 包含虚拟DOM创建(creation)和打补丁(patching)的代码
│   │   ├── instance ---------------------- 包含Vue构造函数设计相关的代码
│   │   ├── global-api -------------------- 包含给Vue构造函数挂载全局方法(静态方法)或属性的代码
│   │   ├── components -------------------- 包含抽象出来的通用组件
│   ├── server ---------------------------- 包含服务端渲染(server-side rendering)的相关代码
│   ├── platforms ------------------------- 包含平台特有的相关代码
│   ├── sfc ------------------------------- 包含单文件组件(.vue文件)的解析逻辑，用于vue-template-compiler包
│   ├── shared ---------------------------- 包含整个代码库通用的代码
```
(引自hcysun的博客)

### 构造函数
位置 ： /src/core/instance/index.js
```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
这里声明了Vue构造函数，这里没有用es6 Class的写法，我面先看下后面几个对构造函数的包装，

#### initMixin
对Vue的原型对象上挂在了`_init`方法

```js
Vue.prototype = {
    _init: f (options)
}
```

#### stateMixin
```js
Vue.prototype = {
    $delete: ƒ del(target, key),
    $set: ƒ (target, key, val),
    $watch: ƒ ( expOrFn, cb, options ),
    $data: (...),
    $props: (...),
}
```

#### eventsMixin
```js
Vue.prototype = {
    $emit: ƒ (event)
    $off: ƒ (event, fn)
    $on: ƒ (event, fn)
    $once: ƒ (event, fn)
}
```

### lifecycleMixin
```js
Vue.prototype = {
    $destroy: ƒ ()
    $forceUpdate: ƒ ()
    _update: ƒ (vnode, hydrating)
}
```

#### renderMixin
```js
Vue.prototype = {
    $nextTick: ƒ (fn)
    _b: ƒ bindObjectProps( data, tag, value, asProp, isSync )
    _d: ƒ bindDynamicKeys(baseObj, values)
    _e: ƒ (text)
    _f: ƒ resolveFilter(id)
    _g: ƒ bindObjectListeners(data, value)
    _i: ƒ looseIndexOf(arr, val)
    _k: ƒ checkKeyCodes( eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName )
    _l: ƒ renderList( val, render )
    _m: ƒ renderStatic( index, isInFor )
    _n: ƒ toNumber(val)
    _o: ƒ markOnce( tree, index, key )
    _p: ƒ prependModifier(value, symbol)
    _q: ƒ looseEqual(a, b)
    _render: ƒ ()
    _s: ƒ toString(val)
    _t: ƒ renderSlot( name, fallback, props, bindObject )
    _u: ƒ resolveScopedSlots( fns, // see flow/vnode res, // the following are added in 2.6 hasDynamicKeys, contentHashKey )
    _v: ƒ createTextVNode(val)
} 
```

我们想看`this._init(options)`,
这里面的东西也不少,注意如餐 `options`,
我们开发的vue项目中main.js
```js
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app');
```
传入的`options`是什么一眼就看出来了，为什么要用new，就不说，最后还有一个 `$mount('#app')`,记着后续会说


#### this._init(options)
位置： /src/core/instance/init.js

```js
export function initMixin (Vue: Class<Component>) {
    // 注意在这里
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

其实是在调用`initMIxin()`的时候Vue加一个原型方法`_init()`
这里大家不知道有没有一个问题，为什么不直接写在Vue的构造函数中，而是要注册一个方法，

继续看 `_init`里面，有一步操作是吧 `vm.constructor` 和入参 `options` 都挂在到 `vm.$options`上了
结果就是 `vm.$options` 包含了`options`, 以及 `vm.$options._base ==== vm.constructor`

后续是一系列的init，加上2个回调声明周期的钩子，这里有个顺序，就是先 initState 后调用created的钩子，所以
created 可以获取data，但是beforeCreated就不可以了，让后initRender是在created后执行，所以created钩子里不能
去操作dom，因为dom还没渲染呢

最后Vue构造函数 构造出来的的 Vue实例
```js
vm = {
    $attrs: (...)
    $children: []
    $createElement: ƒ (a, b, c, d)
    $el: div#demo
    $listeners: (...)
    $options: {components: {…}, directives: {…}, filters: {…}, el: "#demo", _base: ƒ, …}
    $parent: undefined
    $refs: {}
    $root: Vue {_uid: 0, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: Vue, …}
    $scopedSlots: {}
    $slots: {}
    $vnode: undefined
    branches: (...)
    commits: (...)
    currentBranch: (...)
    fetchData: ƒ ()
    _c: ƒ (a, b, c, d)
    _data: {__ob__: Observer}
    _directInactive: false
    _events: {}
    _hasHookEvent: false
    _inactive: null
    _isBeingDestroyed: false
    _isDestroyed: false
    _isMounted: true
    _isVue: true
    _renderProxy: Proxy {_uid: 0, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: Vue, …}
    _self: Vue {_uid: 0, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: Vue, …}
    _staticTrees: null
    _uid: 0
    _vnode: VNode {tag: "div", data: {…}, children: Array(12), text: undefined, elm: div#demo, …}
    _watcher: Watcher {vm: Vue, deep: false, user: false, lazy: false, sync: false, …}
    _watchers: (2) [Watcher, Watcher]
    $data: (...)
    $isServer: (...)
    $props: (...)
    $ssrContext: (...)
}
```
**`vm.__proto__ `以及 `Vue.prototype`**
```js
Vue,prototype = {
    $delete: ƒ del(target, key)
    $destroy: ƒ ()
    $emit: ƒ (event)
    $forceUpdate: ƒ ()
    $mount: ƒ ( el, hydrating )
    $nextTick: ƒ (fn)
    $off: ƒ (event, fn)
    $on: ƒ (event, fn)
    $once: ƒ (event, fn)
    $set: ƒ (target, key, val)
    $watch: ƒ ( expOrFn, cb, options )
    __patch__: ƒ patch(oldVnode, vnode, hydrating, removeOnly)
    _b: ƒ bindObjectProps( data, tag, value, asProp, isSync )
    _d: ƒ bindDynamicKeys(baseObj, values)
    _e: ƒ (text)
    _f: ƒ resolveFilter(id)
    _g: ƒ bindObjectListeners(data, value)
    _i: ƒ looseIndexOf(arr, val)
    _init: ƒ (options)
    _k: ƒ checkKeyCodes( eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName )
    _l: ƒ renderList( val, render )
    _m: ƒ renderStatic( index, isInFor )
    _n: ƒ toNumber(val)
    _o: ƒ markOnce( tree, index, key )
    _p: ƒ prependModifier(value, symbol)
    _q: ƒ looseEqual(a, b)
    _render: ƒ ()
    _s: ƒ toString(val)
    _t: ƒ renderSlot( name, fallback, props, bindObject )
    _u: ƒ resolveScopedSlots( fns, // see flow/vnode res, // the following are added in 2.6 hasDynamicKeys, contentHashKey )
    _update: ƒ (vnode, hydrating)
    _v: ƒ createTextVNode(val)
    $data: (...)
    $isServer: (...)
    $props: (...)
    $ssrContext: (...)
}
```

很多细节还是需要自己去看！