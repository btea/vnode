import flags  from './flags'
import {mount} from './render'
import patchData from './patchData'
import patchChildren from './patchChildren'

const {VNodeFlags, ChildrenFlags} = flags
export function patch(prevVNode, nextVNode, container) {
	// 分别拿到新旧 VNode 的类型，即 flags
	const nextFlags = nextVNode.flags
	const prevFlags = prevVNode.flags
  
	// 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
	// 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
	if (prevFlags !== nextFlags) {
	  replaceVNode(prevVNode, nextVNode, container)
	} else if (nextFlags & VNodeFlags.ELEMENT) {
	  patchElement(prevVNode, nextVNode, container)
	} else if (nextFlags & VNodeFlags.COMPONENT) {
	  patchComponent(prevVNode, nextVNode, container)
	} else if (nextFlags & VNodeFlags.TEXT) {
	  patchText(prevVNode, nextVNode)
	} else if (nextFlags & VNodeFlags.FRAGMENT) {
	  patchFragment(prevVNode, nextVNode, container)
	} else if (nextFlags & VNodeFlags.PORTAL) {
	  patchPortal(prevVNode, nextVNode)
	}
}

// 替换 VNode
function replaceVNode(prevVNode, nextVNode, container) {
	// 将旧的 VNode 所渲染的 DOM 从容器中移除
	container.removeChild(prevVNode.el)
	// 再把新的 VNode 挂载到容器上
	mount(nextVNode, container)
}

function patchElement(prevVNode, nextVNode, container) {
	// 如果新的 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
	if (prevVNode.tag !== nextVNode.tag) {
		replaceVNode(prevVNode, nextVNode, container)
		return
	}
	// 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素 
	const el = (nextVNode.el = prevVNode.el)
	// 拿到新旧 VNodeData
	const prevData = prevVNode.data
	const nextData = nextVNode.data

	if (nextData) {
		// 遍历新的 VNodeData ，将旧值和新值传递给 patchData函数
		for (let key in nextData) {
			const prevValue = prevData[key]
			const nextValue = nextData[key]
			patchData(el, key, prevValue, nextValue)
		}
	}

	if (prevData) {
		// 遍历旧的 VNodeData，将不存在与新的 VNodeData 中的数据移除
		for (let key in prevData) {
			const prevValue = prevData[key]
			if (prevValue && !nextData.hasOwnProperty(key)) {
				// 第四个参数为null代表移除数据
				patchData(el, key, prevValue, null)
			}
		}
	}
	// 调用 patchChildren 函数递归更新子节点
	patchChildren(
		prevVNode.childFlags, // 旧的 VNode 子节点类型
		nextVNode.childFlags, // 新的 VNode 子节点类型
		prevVNode.children,   // 旧的 VNode 子节点
		nextVNode.children,   // 新的 VNode 子节点
		el                    // 当前标签元素，即这些子节点的父节点
	)
}

// patchText
function patchText(prevVNode, nextVNode) {
	// 拿到文本元素el, 同时让 nextVNode.el 指向该文本元素
	const el = (nextVNode.el = prevVNode.el)
	// 只有当新旧文本内容不一致时才有必要更新
	if (nextVNode.children !== prevVNode.children) {
		el.nodeValue = nextVNode.children
	}
}

function patchFragment(prevVNode, nextVNode, container) {
	// 直接调用 patchChildren 函数更新 新旧节点的子节点即可
	patchChildren(
		prevVNode.childFlags, 
		nextVNode.childFlags,
		prevVNode.children,
		nextVNode.children,
		container
	)

	// 如上高亮代码所示，我们通过检查新的片段的 children 类型，如果新的片段的 children 类型是单个子节点，则意味着其 vnode.children 属性的值就是 VNode 对象，
	// 所以直接将 nextVNode.children.el 赋值给 nextVNode.el 即可。如果新的片段没有子节点，我们知道对于没有子节点的片段我们会使用一个空的文本节点占位，
	// 而 prevVNode.el 属性引用的就是该空文本节点，所以我们直接通过旧片段的 prevVNode.el 拿到该空文本元素并赋值给新片段的 nextVNode.el 即可。
	// 如果新的片段的类型是多个子节点，则 nextVNode.children 是一个 VNode 数组，我们会让新片段的 nextVNode.el 属性引用数组中的第一个元素。
	// 实际上这段逻辑与我们在 mountFragment 函数中所实现的逻辑是一致的。
	switch (nextVNode.childFlags) {
		case ChildrenFlags.SINGLE_VNODE:
			nextVNode.el = nextVNode.children.el
			break
		case ChildrenFlags.NO_CHILDREN:
			nextVNode.el = prevVNode.el
			break
		default:
			nextVNode.el = nextVNode.children[0].el
	}
}

// 更新Protal
function patchPortal(prevVNode, nextVNode) {
	patchChildren(
		prevVNode.childFlags,
		nextVNode.childFlags,
		prevVNode.children,
		nextVNode.children,
		prevVNode.tag  // 注意容器元素是旧的container
	)

	// 让 nextVNode.el 指向 prevVNode.el
	nextVNode.el = prevVNode.el

	if (nextVNode.tag !== prevVNode.tag) {
		const container = typeof nextVNode.el === 'string' ? document.querySelector(nextVNode.tag) : nextVNode.tag
		switch (nextVNode.childFlags) {
			case ChildrenFlags.SINGLE_VNODE:
				container.appendChild(nextVNode.children.el)
				break
			case ChildrenFlags.NO_CHILDREN:
				break
			default:
				for (let i = 0; i < nextVNode.children.length; i++) {
					container.appendChild(nextVNode.children[i].el)
				}
				break
		}
	}
}

// 更新 Component
function patchComponent(prevVNode, nextVNode, container) {
	// 父组件props改变导致子组件更新，可能更新前后渲染不同子组件
	// tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否相同的组件
	if (prevVNode.tag !== nextVNode.tag) {
		replaceVNode(prevVNode, nextVNode, container)
	}
	// 检查组件是否是有状态组件
	if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORAMAL) {
		// 1、获取组件实例
		const instance = (nextVNode.children = prevVNode.children)
		// 2、更新props
		instance.$props = nextVNode.data
		// 3、更新组件
		instance._update()
	}
}