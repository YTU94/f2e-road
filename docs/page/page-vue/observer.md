### 响应式数据过程

本节的源文件位置：src/core/instance/Observer (还有一点 本节的内容基本都是用的 es6 class)

首先我看下官方文档的一个简单介绍
[!https://cn.vuejs.org/images/data.png]
我们需要先了解 `Object.defineProperty()`, 这个是 vue2 响应式的根本，然后 vue 响应式的整个链路 可以看上图，
我们先说说 这几个东西是什么 Watcher Dep Observer

我们 害己的 对 data 的响应式是从一个 observe(data) 开始的，我们知道这个 observe 函数，它主要做了什么呢

```js
Zfunction observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value) // 看这里
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

看代码，主要就是通过 Observer 类 创建了一个新的对象实力，那么我们在看 Observer 类给 data 做了什么

```js
class Observer {
    value: any
    dep: Dep
    vmCount: number // number of vms that have this object as root $data

    constructor(value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, "__ob__", this)
        this.walk(value)
    }

    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk(obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}
```

去除数组的处理 就是循环调用 defineReactive

```js （代码已删减）
function defineReactive(obj: Object, key: string, val: any, customSetter?: ?Function, shallow?: boolean) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    // cater for pre-defined getter/setters
    const getter = property && property.get
    const setter = property && property.set

    let childOb = !shallow && observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend() // 看这里
                if (childOb) {
                    childOb.dep.depend()
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val
            /* eslint-disable no-self-compare */
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            dep.notify() // 看这里
        }
    })
}
```

我们主要做的是 实力话了一个 Dep 类，
在 get 的时候 调用 depend()（其实就是 addDep）,
在 set 的是欧 抵用 notfy() (像广播一样去触发更新，这个更新是什么呢， 存在那里呢 我看看 Watcher 就知道了)
看到这里 我们可能要先知道 Dep 类 到底是什么 有什么用 为什么（素质三联）？

### Dep——依赖收集器

先看 Dep 类

```js
default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id);
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
```

通过代码 可以看出来 依赖收集器 就是一个存放 着 Watcher 的数组（这里的设计 涉及到栈理念），
官方文档也说了每个组件都有一个 watch 实例，我们来看下 Watcher

### Watcher

先看代码 (已删减)

```js
class Watcher {
    vm: Component
    cb: Function
    id: number
    deep: boolean
    sync: boolean
    dirty: boolean
    active: boolean
    deps: Array<Dep>
    newDeps: Array<Dep>
    depIds: SimpleSet
    newDepIds: SimpleSet
    before: ?Function
    getter: Function
    value: any

    constructor(vm: Component, expOrFn: string | Function, cb: Function, options?: ?Object, isRenderWatcher?: boolean) {
        this.vm = vm

        this.cb = cb
        this.id = ++uid // uid for batching
        this.active = true
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()

        this.value = this.lazy ? undefined : this.get()
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            throw e
        } finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                traverse(value)
            }
            popTarget()
            this.cleanupDeps()
        }
        return value
    }

    /**
     * Add a dependency to this directive.
     */
    addDep(dep: Dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        /* istanbul ignore else */
        if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get()
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep
            ) {
                // set new value
                const oldValue = this.value
                this.value = value
                this.cb.call(this.vm, value, oldValue)
            }
        }
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}
```

在依赖收集阶段，有个相互的过程，感觉需要一个流程图
![http://assets.ytuj.cn/img/Snipaste_2020-06-17_10-43-43.png](http://assets.ytuj.cn/img/Snipaste_2020-06-17_10-43-43.png)

简单梳理下依赖收集的过程：

其中 Dep 俗称为依赖收集机，它具体干了写什么呢，首先它是绑定在每一个响应式变量中的，这个触发点是变量的 get funtion 被触发，这就是我们收集的依赖，此时此刻某个变量使用到了当前变量的值，所以 get 被触发，所以当前变量的 dep 实力的 target 指向的 watcher 实例中的一个存放 dep 的数组会 push 压入 这个 dep 实例，

说说几个巧妙的设计点：

-   Dep 类的 一个静态属性 target 一直指向当前的 active watcher 实例；
-   所有 data 中的响应式变量，在开始响应式即（defineProperty）的时候都会 new 一个 Dep 类，其实没有明确的绑定关系，只是
    dep 的数量会和页面所有响应式的变量一样
-   变量 get 被触发时，从 dep 来触发 dep.target === watcher => addDep(this), 这是通知 watcher 收集这个依赖，然后 watcher 中判断 如果之前没有这个 dep，那么在 newDeps 中添加这个 dep 依赖，并且如果 watcher 中 depIds 没有这个 dep，那么通知 dep 的 subs 去添加我这个 watcher，这个返回去在 dep 中找一个地方存放 wather 是干嘛用的呢？应为我们的依赖关系都收藏在 watcher 的 newDeps 中，它包含了当前组件的所有依赖，但是都某一个变量改动，我们怎么知道去找到这个变量的依赖，所以就需要在 dep 中的 subs 来存放 当数据变化时需要去通知那些 wathcer 去触发更新,触发更新
   涉及到有两个地方：watcher 的实例的第三个入参数是一个 cb(fucntion),
```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
//
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
},
```
触发更新就是直接执行
vm._update(vm._render(), hydrating)，
1.先执行 vm._render() => 返回一个 vnode
2.再执行 vm_update() => vm.__patch__(vm._vnode, null) (更新新老vnode)

### 过程分析
1.new Watcher() 开始
2.执行watcher类的contructor，
3.构造里面执行 this.get(), 来获取value值，
4.this.get()中，辅助操作把当前watcher推入 watcher栈，然后主要执行 value = this.getter.call(vm, vm)
getter是传入的取值function，对于页面的getter就是调用 updateComponent,
4.updateComponent函数主要执了 vm._update(vm._render(), hydrating)
5.vm._render() 会生成一个vNode中间会触发data中数据的getter 这时候dep 开始收集依赖