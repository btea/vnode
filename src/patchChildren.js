import { patch } from './patch';
import flags from './flags';
import { mount } from './render';
const { ChildrenFlags } = flags;

export default function patchChildren(prevChildFlags, nextChildFlags, prevChildren, nextChildren, container) {
    switch (prevChildFlags) {
        // 旧的 children 是单个子节点
        case ChildrenFlags.SINGLE_VNODE:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的 children 也是单个子节点
                    // 此时，prevChidren 和 nextChildren 都是 VNode 对象
                    patch(prevChildren, nextChildren, container);
                    break;
                case ChildrenFlags.NO_CHILDREN:
                    // 新的 children 没有子节点
                    container.removeChild(prevChildren.el);
                    break;
                default:
                    // 新的 children 有多个子节点
                    container.removeChild(prevChildren.el);
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container);
                    }
                    break;
            }
            break;
        // 旧的 children 没有子节点
        case ChildrenFlags.NO_CHILDREN:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的 children 也是单个子节点
                    mount(nextChildren, container);
                    break;
                case ChildrenFlags.NO_CHILDREN:
                    // 新的 children 没有子节点
                    break;
                default:
                    // 新的 children 有多个子节点
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container);
                    }
                    break;
            }
            break;
        // 旧的 children 有多个子节点
        default:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的 children 也是单个子节点
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el);
                    }
                    mount(nextChildren, container);
                    break;
                case ChildrenFlags.NO_CHILDREN:
                    // 新的 children 没有子节点
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el);
                    }
                    break;
                default:
                    // 新的 children 有多个子节点   DIFF（简单的diff算法）
                    // 遍历旧的子节点，将其全部移除
                    // for (let i = 0; i < prevChildren.length; i++) {
                    // 	container.removeChild(prevChildren[i].el)
                    // }
                    // // 遍历新的子节点，将其全部添加
                    // for (let k = 0; k < nextChildren.length; k++) {
                    // 	mount(nextChildren[k], container)
                    // }

                    // 获取公共长度，取新旧 children 长度较小那一个
                    // const prevLen = prevChildren.length
                    // const nextLen = nextChildren.length
                    // const commonLength = prevLen > nextLen ? nextLen : prevLen
                    // for (let i = 0; i < commonLength; i++) {
                    // 	patch(prevChildren[i], nextChildren[i], container)
                    // }
                    // // 如果nextLen 大于 prevLen,将多出来的元素添加
                    // if (nextLen > prevLen) {
                    // 	for (let i = commonLength; i < nextLen; i++) {
                    // 		mount(nextChildren[i], container)
                    // 	}
                    // } else if (prevLen > nextLen) {
                    // 	// 如果 prevLen > nextLen, 将多出的元素移除
                    // 	for (let i = commonLength; i < prevLen; i++) {
                    // 		container.removeChild(prevChildren[i].el)
                    // 	}
                    // }

                    /**  利用 key 进行优化 **/ // React所用的算法
                    // 用来存储寻找过程中遇到的最大索引值
                    // let lastIndex = 0
                    // // 遍历新的children
                    // for (let i = 0; i < nextChildren.length; i++) {
                    // 	const nextVNode = nextChildren[i]
                    // 	let j = 0, find = false  // find 用来判断新的 children中 当前节点是否存在于旧的 children 中
                    // 	for (j; j < prevChildren.length; j++) {
                    // 		const prevVNode = prevChildren[j]
                    // 		// 如果找到了具有相同 key 值的两个节点， 则调用 patch 函数更新
                    // 		if (nextVNode.key === prevVNode.key) {
                    // 			find = true
                    // 			patch(prevVNode, nextVNode, container)
                    // 			if (j < lastIndex) {
                    // 				// 需移动
                    // 				// refNode 是为了下面调用 insertBefore 函数准备的
                    // 				const refNode = nextChildren[i - 1].el.nextSibling
                    // 				// 利用insertBefore函数移动 DOM
                    // 				container.insertBefore(prevVNode.el, refNode)
                    // 			} else {
                    // 				// 更新lastIndex
                    // 				lastIndex = j
                    // 			}
                    // 			break
                    // 		}
                    // 	}
                    // 	if (!find) {
                    // 		// 挂载新节点
                    // 		// 找到 refNode
                    // 		const refNode = i - 1 < 0 ? prevChildren[0].el : nextChildren[i - 1].el.nextSibling
                    // 		mount(nextVNode, container, false, refNode)
                    // 	}
                    // }
                    // // 移除已经不存在的节点
                    // // 遍历旧节点
                    // for (let i = 0; i < prevChildren.length; i++) {
                    // 	const prevVNode = prevChildren[i]
                    // 	// 拿旧 VNode 去新 children中寻找相同的节点
                    // 	const has = nextChildren.find(
                    // 		nextVNode => nextVNode.key === prevVNode.key
                    // 	)
                    // 	if (!has) {
                    // 		container.removeChild(prevVNode.el)
                    // 	}
                    // }

                    /****      双端比较      ****/
                    // let oldStartIdx  = 0
                    // let oldEndIdx    = prevChildren.length - 1
                    // let newStartIdx  = 0
                    // let newEndIdx    = nextChildren.length - 1

                    // let oldStartVNode = prevChildren[oldStartIdx]
                    // let oldEndVNode   = prevChildren[oldEndIdx]
                    // let newStartVNode = nextChildren[newStartIdx]
                    // let newEndVNode   = nextChildren[newEndIdx]

                    // while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                    // 	if (!oldStartVNode) {
                    // 		oldStartVNode = prevChildren[++oldStartIdx]
                    // 	} else if (!oldEndVNode) {
                    // 		oldEndVNode = prevChildren[--oldEndIdx]
                    // 	}else if (oldStartVNode.key === newStartVNode.key) {
                    // 		// 步骤一：oldStartVNode 与 newStartVNode 对比

                    // 		// 调用 patch 函数更新
                    // 		patch(oldStartVNode, newStartVNode, container)
                    // 		// 更新索引，指向下一个位置
                    // 		oldStartVNode = prevChildren[++oldStartIdx]
                    // 		newStartVNode = nextChildren[++newStartIdx]
                    // 	} else if (oldEndVNode.key === newEndVNode.key) {
                    // 		// 步骤二：oldEndVNode 与 newEndVNode 对比

                    // 		// 调用 patch 函数更新
                    // 		patch(oldEndVNode, newEndVNode, container)
                    // 		oldEndVNode = prevChildren[--oldEndIdx]
                    // 		newEndVNode = nextChildren[--newEndIdx]
                    // 	} else if (oldStartVNode.key === newEndVNode.key) {
                    // 		// 步骤三：oldStartVNode 与 newEndVNode 对比

                    // 		// 调用 patch 函数更新
                    // 		patch(oldStartVNode, newEndVNode, container)
                    // 		// 将 oldStartVNode.el 移动到 oldEndVNode.el 的后面，也就是 oldEndVNode.el.nextSibling的前面
                    // 		container.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)
                    // 		// 更新索引，指向下一个位置
                    // 		oldStartVNode = prevChildren[++oldStartIdx]
                    // 		newEndVNode = nextChildren[--newEndIdx]
                    // 	} else if (oldEndVNode.key === newStartVNode.key) {
                    // 		// 步骤四：oldEndVNode 与 newStartVNode 对比
                    // 		// 先调用 patch 函数完成更新
                    // 		patch(oldEndVNode, newStartVNode, container)
                    // 		// 更新完成后，将容器中最后一个子节点移动到最前面，使其成为第一个子节点
                    // 		container.insertBefore(oldEndVNode.el, oldStartVNode.el)
                    // 		// 更新索引，指向下一位置
                    // 		oldEndVNode = prevChildren[--oldEndIdx]
                    // 		newStartVNode = nextChildren[++newStartIdx]
                    // 	} else {
                    // 		// 遍历旧 children，视图寻找与 newStartVNode 拥有相同 key 的元素
                    // 		const idxInOld = prevChildren.findIndex(
                    // 			node => node.key === newStartVNode.key
                    // 		)
                    // 		if (idxInOld > 0) {
                    // 			// vnodeToMove 就是在旧 children 中找到的节点，该节点对应的真实 DOM 应该被移动到最前面
                    // 			const vnodeToMove = prevChildren[idxInOld]
                    // 			// 调用 patch 函数完成更新
                    // 			patch(vnodeToMove, newStartVNode, container)
                    // 			// 把 vnodeToMove.el 移动到最前面，即 oldStartVNode.el 的前面
                    // 			container.insertBefore(vnodeToMove.el, oldStartVNode.el)
                    // 			// 由于旧 children 中该位置的节点所对应的真实 DOM 已经被移动，所以将其设置为 undefined
                    // 			prevChildren[idxInOld] = void 0
                    // 		} else {
                    // 			// 这是新增节点，在旧 children 中没有，使用 mount 函数挂载新节点
                    // 			mount(newStartVNode, container, false, oldStartVNode.el)
                    // 		}
                    // 		// 将 newStartIdx 下移一位
                    // 		newStartVNode = nextChildren[++newStartIdx]
                    // 	}
                    // }

                    // if (oldEndIdx < oldStartIdx) {
                    // 	// 添加新节点
                    // 	// 栗子
                    // 	// 旧children  [li-a, li-b, li-c]
                    // 	// 新children  [li-d, li-a, li-b, li-c]
                    // 	for (let i = newStartIdx; i < newEndIdx; i++) {
                    // 		mount(nextChildren[i], container, false, oldStartVNode.el)
                    // 	}
                    // } else if (newEndIdx < newStartIdx) {
                    // 	// 移除操作
                    // 	// 栗子
                    // 	// 旧children  [li-a, li-b, li-c]
                    // 	// 新children  [li-a, li-c]
                    // 	for (let i = oldStartIdx; i < oldEndIdx; i++) {
                    // 		container.removeChild(prevChildren[i].el)
                    // 	}
                    // }

                    /**************** inferno ***************/
                    // 更新相同的前缀节点
                    let j = 0;
                    let prevVNode = prevChildren[j];
                    let nextVNode = nextChildren[j];
                    let prevEnd = prevChildren.length - 1;
                    let nextEnd = nextChildren.length - 1;
                    outer: {
                        while (prevVNode.key === nextVNode.key) {
                            patch(prevVNode, nextVNode, container);
                            j++;
                            if (j > prevEnd || j > nextEnd) {
                                break outer;
                            }
                            prevVNode = prevChildren[j];
                            nextVNode = nextChildren[j];
                        }
                        // 更新相同的后缀节点

                        prevVNode = prevChildren[prevEnd];
                        nextVNode = nextChildren[nextEnd];
                        while (prevVNode.key === nextVNode.key) {
                            patch(prevVNode, nextVNode, container);
                            prevEnd--;
                            nextEnd--;
                            if (j > prevEnd || j > nextEnd) {
                                break outer;
                            }
                            prevVNode = prevChildren[prevEnd];
                            nextVNode = nextChildren[nextEnd];
                        }
                    }

                    // 满足条件，则说明 j -> nextEnd 之间的节点应该作为新节点插入
                    if (j > prevEnd && j <= nextEnd) {
                        // 所有节点应该插入到位于 nextPos 的节点位置前面
                        const nextPos = nextEnd + 1;
                        const refNode = nextPos < nextChildren.length ? nextChildren[nextPos] : null;
                        // 采用 while 循环，调用 mount 函数挂载节点
                        while (j <= nextEnd) {
                            mount(nextChildren[j++], container, false, refNode);
                        }
                    } else if (j > nextEnd) {
                        // j ->  prevEnd 之间的节点应该被删除
                        while (j <= prevEnd) {
                            container.removeChild(prevChildren[j++].el);
                        }
                    } else {
                        // 构造 source 数组
                        const nextLeft = nextEnd - j + 1; // 新 children 中剩余未处理节点数
                        const source = new Array(nextLeft).fill(-1);

                        const prevStart = j;
                        const nextStart = j;
                        let moved = false;
                        let pos = 0;
                        // for (let i = prevStart; i < prevEnd; i++) {
                        // 	const prevNode = prevChildren[i]
                        // 	// 遍历新 children
                        // 	for (let k = nextStart; k < nextEnd; k++) {
                        // 		const nextNode = nextChildren[k]
                        // 		// 找到拥有相同 key 值的可复用节点
                        // 		if (prevNode.key === nextNode.key) {
                        // 			// patch 更新
                        // 			patch(prevNode, nextNode, container)
                        // 			// 更新source数组
                        // 			source[k - nextStart] = i
                        // 			// 判断是否需要移动
                        // 			if (k < pos) {
                        // 				moved = true
                        // 			} else {
                        // 				pos = k
                        // 			}
                        // 		}
                        // 	}
                        // }

                        // 构建索引列表
                        const keyIndex = {};
                        for (let i = nextStart; i <= nextEnd; i++) {
                            keyIndex[nextChildren[i].key] = i;
                        }
                        let patched = 0;
                        // 遍历旧 children 的剩余未处理节点
                        for (let i = prevStart; i <= prevEnd; i++) {
                            prevVNode = prevChildren[i];
                            if (patched < nextLeft) {
                                // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
                                const k = keyIndex[prevVNode.key];
                                if (typeof k !== 'undefined') {
                                    nextVNode = nextChildren[k];
                                    // patch 更新
                                    patch(prevVNode, nextVNode, container);
                                    patched++;
                                    // 更新 source 数组
                                    source[k - nextStart] = i;
                                    // 判断是否需要移动
                                    if (k < pos) {
                                        moved = true;
                                    } else {
                                        pos = k;
                                    }
                                } else {
                                    // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
                                    container.removeChild(prevVNode.el);
                                }
                            } else {
                                // 多余的节点，应该移除
                                container.removeChild(prevVNode.el);
                            }
                        }
                    }
                    break;
            }
            break;
    }
}
