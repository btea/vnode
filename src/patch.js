import {VNodeFlags, ChildrenFlags}  from './flags'
import {mount} from './render'

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
