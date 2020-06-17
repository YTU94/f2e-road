### 响应式数据起始

不知道你是否还是记得  `initState(vm)` (位置： /src/core/instance/init.js),
我们看下`iniSate`做了些什么,代码如下：
```js
function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

看上面的代码 4额个init*函数的 就是把data，props, methods, watch做一个初始化，
注意看initData的内容
```js
function initData(vm: Component) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (process.env.NODE_ENV !== "production") {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```
最后一个一个`observer()`的执行就是对data 里面的数据进行响应式，那么响应式的内容黄祖耀也都
在 `/src/core/observer/`中，类似的对于props数据调用了`toggleObserving()`,
注意initData代码中的一个点 就是判断data是不是function，我们一般些vue组件的时候都是这样的

```js
    data () {
        return {}
    }
    // 与此同时,下面的写法也是支持的
    data {}
```

那么有什么区别呢，看代码中是 function 情况下 调用`getData(data, vm)`, 我们在看这个函数
```js
    function getData(data: Function, vm: Component): any {
        // #7573 disable dep collection when invoking data getters
        pushTarget();
        try {
            return data.call(vm, vm);
        } catch (e) {
            handleError(e, vm, `data()`);
            return {};
        } finally {
            popTarget();
        }
    }
```
内容不到，除去pushTarget();popTarget();, 就执行了一个 `data.call(vm, vm)`, 那么这是做什么，
我们先看下此时的data是什么, 我debugger看到的是
```js
data =  function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
```
这段代码执行后data还是我们的data，即vue文件中的定义的data返回的对象