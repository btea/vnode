import flags from "./flags";
import { patch } from "./patch";
import patchData from './patchData'
const { VNodeFlags, ChildrenFlags } = flags;
import { createTextVNode } from './h'

export function render(vnode, container) {
  const prevVNode = container.vnode;
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container);
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode就存在了
      container.vnode = vnode;
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container);
      // 更新 container.vnode
      container.vnode = vnode;
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM,在浏览器中可以使用 removeChild函数。
      container.removeChild(prevVNode.el);
      container.vnode = null;
    }
  }
}

export function mount(vnode, container, isSVG, refNode) {
  const { flags } = vnode;
  if (flags & VNodeFlags.ELEMENT_HTML) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, refNode);
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG);
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载存文本
    mountText(vnode, container);
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载Fragment
    mountFragment(vnode, container, isSVG);
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG);
  }
}

// 处理VNodeData中除 class 和 style 之外的全部数据，当然也要排除 VNodeData中的target属性，因为它只适用于 Portal
const domPropsRE = /\[A-Z]|^(?:value|checked|slected|muted)$/;

function mountElement(vnode, container, isSVG, refNode) {
  // 注：运算符优先级  逻辑或 5 (||)从左到右  按位与 9(&) 从左到右

  // 4、处理SVG标签
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG;
  const el = isSVG
    ? document.createElementNS("http://www.w3.org/2000/svg", vnode.tag)
    : document.createElement(vnode.tag);
  vnode.el = el; // 1、VNode渲染成真实DOM之后，引用真实DOM
  // 拿到 VNodeData
  const data = vnode.data;
  if (data) {
	for (let key in data) {
		patchData(el, key, null, data[key])
	}
  }
  // 3、继续挂载子节点
  // 拿到children 和 childFlags
  const childFlags = vnode.childFlags;
  const children = vnode.children;
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 单个子节点则调用mount挂载
      mount(children, el, isSVG); // 把isSvg传递下去，方便后续判断渲染svg里面circle等元素tag不等于svg时渲染svg标签
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是多个子节点，则遍历并调用 mount 函数挂载
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG);
      }
    }
  }
  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
//   container.appendChild(el);
}

// 挂载组件
function mountComponent(vnode, container, isSVG) {
	if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
		mountStatefulComponent(vnode, container, isSVG)
	} else {
		mountFunctionalComponent(vnode, container, isSVG)
	}
}
// 挂载有状态组件
function mountStatefulComponent(vnode, container, isSVG) {
	// 1、创建组件实例
	const instance = (vnode.children = new vnode.tag())
	// 初始化 props
	instance.$props = vnode.data
	instance._update = function() {
		// 如果instance_mounted为真，说明组件已经挂载，应该执行更新操作
		if (instance._mounted) {
			// 1、拿到旧的VNode
			const prevVNode = instance.$vnode
			// 2、重新渲染VNode
			const nextVNode = (instance.$vnode = instance.render())
			// 3、patch更新
			patch(prevVNode, nextVNode, prevVNode.el.parentNode)
			// 4、更新 vnode.el 和 $el
			instance.$el = vnode.el = instance.$vnode.el
		} else {
			// 1、渲染 Vnode
			instance.$vnode = instance.render()
			// 2、mount挂载
			mount(instance.$vnode, container, isSVG)
			// 3、组件已挂载的标识
			instance._mounted = true
			// 4、让组件实例的 $el 属性和 vnode.el 属性的值引用组件的根DOM元素
			instance.$el = vnode.el = instance.$vnode.el
			// 5、调用 mounted 钩子
			instance.mounted && instance.mounted()
		}
	}
	instance._update()
}

// 挂载函数式组件
function mountFunctionalComponent(vnode, container, isSVG) {
	// 获取 props
	// const props = vnode.data
	// // 获取vnode
	// const $vnode = (vnode.children =  vnode.tag(props))
	// // 挂载
	// mount($vnode, container, isSVG)
	// // el元素引用该组件的根元素
	// vnode.el = $vnode.el

	// 在函数式组件类型的 vnode 上添加 handle 属性，它是一个对象
	vnode.handle = {
		prev: null,
		next: vnode,
		container,
		update: () => {
			if (vnode.handle.prev) {
				// 更新
				// prevVNode 是旧的组件 VNode，nextVNode 是新的组件 VNode
				const prevVNode = vnode.handle.prev
				const nextVNode = vnode.handle.next
				// prevTree 是组件产出 旧的 VNode
				const prevTree = prevVNode.children
				// 更新 props 数据
				const props = nextVNode.data
				// nextTree是组件产出的新的 VNode
				const nextTree = (nextVNode.children = nextVNode.tag(props))
				// 调用patch函数更新
				patch(prevTree, nextTree, vnode.handle.container)
			} else {
				// 初始化 props
				const props = vnode.data
				// 获取 VNode
				const $vnode = (vnode.children = vnode.tag(props))
				// 挂载
				mount($vnode, container, isSVG)
				// el属性引用该组件的根元素
				vnode.el = $vnode.el
			}
		}
	}
	// 立即调用 vnode.handle.update完成初次挂载
	vnode.handle.update()
}

// 挂载纯文本
function mountText(vnode, container){
	const el = document.createTextNode(vnode.children)
	vnode.el = el
	container.appendChild(el)
}

// 挂载Fragment
function mountFragment(vnode, container, isSVG) {
	// 拿到children 和 childFlags
	const {children, childFlags} = vnode
	switch (childFlags) {
		case ChildrenFlags.SINGLE_VNODE:
			mount(children, container, isSVG)
			vnode.el = children.el
			break
		case ChildrenFlags.NO_CHILDREN:
			// 没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
			const placeholder = createTextVNode('')
			mountText(placeholder, container)
			vnode.el = placeholder.el
			break
		default:
			// 多个子节点，遍历挂载
			for (let i = 0; i < children.length; i++) {
				mount(children[i], container, isSVG)
			}
			vnode.el = children[0].el
			break
	}
}

// 挂载 Portal
function mountPortal(vnode, container, isSVG) {
	const {tag, children, childFlags} = vnode
	// 获取挂载点
	const target = typeof tag === 'string' ? document.querySelector(tag) : tag
	if (childFlags & ChildrenFlags.SINGLE_VNODE) {
		// 将children挂载到target上，而非container
		mount(children, target)
	} else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
		for (let i = 0; i < children.length; i++) {
			mount(children[i], target)
		}
	}
	// 占位的空文本节点
	const placeholder = createTextVNode('')
	// 将该节点挂载到 container 中
	mountText(placeholder, container, null)
	// el属性引用该节点
	vnode.el = placeholder.el

}

function dynamicClass(className) {
	if (typeof className === "string") {
		return className;
	}
	if (typeof className === "object") {
		if (Array.isArray(className)) {
			let str = "";
			for (let i = 0; i < className.length; i++) {
				if (typeof className[i] === "string") {
					str += className[i] + " ";
				} else if (typeof className[i] === "object") {
					str += dynamicClass(className[i]);
				}
			}
			return str || "";
		} else {
			let str = "";
			for (let key in className) {
				if (typeof className[key] === "boolean" && className[key]) {
					str += key + " ";
				} else if (typeof className[key] === "object") {
					str += dynamicClass(className[key]);
				}
			}
			return str || "";
		}
	}
	return "";
}

export default {
  	render
};
