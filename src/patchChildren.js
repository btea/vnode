import { patch } from "./patch";
import flags from './flags'
import { mount } from "./render";
const {ChildrenFlags} = flags

export default function patchChildren(
	prevChildFlags,
	nextChildFlags,
	prevChildren,
	nextChildren,
	container
) {
	switch (prevChildFlags) {
		// 旧的 children 是单个子节点
		case ChildrenFlags.SINGLE_VNODE:
			switch(nextChildFlags) {
				case ChildrenFlags.SINGLE_VNODE: 
					// 新的 children 也是单个子节点
					// 此时，prevChidren 和 nextChildren 都是 VNode 对象
					patch(prevChildren, nextChildren, container)
					break
				case ChildrenFlags.NO_CHILDREN:
					// 新的 children 没有子节点
					container.removeChild(prevChildren.el)	
					break
				default:
					// 新的 children 有多个子节点
					container.removeChild(prevChildren.el)
					for (let i = 0; i <  nextChildren.length; i++) {
						mount(nextChildren[i], container)
					}
					break
			}
			break
		// 旧的 children 没有子节点
		case ChildrenFlags.NO_CHILDREN:
			switch(nextChildFlags) {
				case ChildrenFlags.SINGLE_VNODE: 
					// 新的 children 也是单个子节点
					mount(nextChildren, container)
					break
				case ChildrenFlags.NO_CHILDREN:
					// 新的 children 没有子节点
					break
				default:
					// 新的 children 有多个子节点
					for (let i = 0; i <  nextChildren.length; i++) {
						mount(nextChildren[i], container)
					}
					break
			}
			break
		// 旧的 children 有多个子节点
		default: 
			switch(nextChildFlags) {
				case ChildrenFlags.SINGLE_VNODE: 
					// 新的 children 也是单个子节点
					for (let i = 0; i < prevChildren.length; i++) {
						container.removeChild(prevChildren[i].el)
					}
					mount(nextChildren, container)
					break
				case ChildrenFlags.NO_CHILDREN:
					// 新的 children 没有子节点
					for (let i = 0; i < prevChildren.length; i++) {
						container.removeChild(prevChildren[i].el)
					}
					break
				default:
					// 新的 children 有多个子节点
					for (let i = 0; i < prevChildren.length; i++) {
						container.removeChild(prevChildren[i].el)
					}
					for (let k = 0; k < nextChildren.length; k++) {
						mount(nextChildren[k], container)
					}
					break
			}
			break
	}
}