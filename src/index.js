import "./styles.css";
import { h } from "./h";
import { render } from "./render";
import { Fragment } from './Fragment'
import { Portal } from './Portal'
function handler() {
  alert("click");
}

// const elementVnode = h(
// 	"div", 
// 	{
//   		style: {
//     		width: "100px",
//     		height: "100px",
//     		backgroundColor: "red"
//   		},
//   		// 点击事件
//   		onclick: handler,
// 	},
	// h(
	// 	Fragment, null, 
	// 	[
	// 		h('h1', {
	// 			style: {
	// 				fontSize: '12px',
	// 				color: 'aqua'
	// 			}
	// 		}, '我是标题1......'),
	// 		h('h2', {
	// 			style: {
	// 				fontSize: '20px',
	// 				color: '#6cf',
	// 				fontStyle: 'itatic'
	// 			}
	// 		}, '我是标题2......')
	// 	]
	// )
// );
// Portal
// const elementVnode = h(
// 	'div',
// 	{
// 		style: {
// 			width: '100px',
// 			height: '100px',
// 			backgroundColor: 'aqua'
// 		},
// 		onclick: handler
// 	},
// 	h(
// 	Portal, { target: '#portal-box' }, 
// 	[
// 		h('span', null, '我是标题1......'),
// 		h('span', null, '我是标题2......')
// 	])
// )

// 有状态组件
class MyComponent{
	render(){
		return h(
			'div',
			{
				style: {
					background: 'green'
				}
			},
			[
				h('span', null, '我是组件标题1·······'),
				h('span', null, '我是组件标题2······')
			]
		)
	}
}
// 函数式组件
function MyFunctionalComponent(){
	return h(
		'div',
		{
			style: {
				background: 'aqua',
				height: '100px',
				width: '100px',
				borderRadius: '50px',
				textAlign: 'center'
			}
		},
		[
			h('span', null, '我是组件标题1······'),
			h('span', null, '我是组件标题2······')
		]
	)
}
const compVnode = h(MyComponent)

const funcVnode = h(MyFunctionalComponent)

// render(funcVnode, document.getElementById("app") || document.body)
// 旧的 VNode
// const prevVNode = h('div', {
//   style: {
//     width: '100px',
//     height: '100px',
//     backgroundColor: 'red'
//   },
//   onclick: handler,
//   data: '1234'
// },
// h('p', {
// 	style: {
// 	  height: '50px',
// 	  width: '50px'
// 	}
// })
// )

// 新的 VNode
// const nextVNode = h('div', {
//   style: {
//     width: '100px',
//     height: '100px',
//     border: '1px solid green'
//   },
//   data: '456'
// },
// h('p', {
// 	style: {
// 	  height: '50px',
// 	  width: '50px',
// 	  background: 'aqua'
// 	}
//   })
// )

// 旧的 VNode 一个子节点
// const prevVNode = h('div', null, h('p', null, '只有一个子节点'))

// 新的 VNode 多个子节点
// const nextVNode = h('div', null, [
//   h('p', null, '子节点 1'),
//   h('p', null, '子节点 2')
// ])


// patchText
// const prevVNode = h('p', null, '旧文本')

// 新的 VNode
// const nextVNode = h('p', null, '新文本')



/**** patch fragment ****/
// 旧的 VNode
// const prevVNode = h(Fragment, null, [
// 	h('p', null, '旧片段子节点 1'),
// 	h('p', null, '旧片段子节点 2')
// ])
  
// 新的 VNode
// const nextVNode = h(Fragment, null, [
// 	h('p', null, '新片段子节点 1'),
// 	h('p', null, '新片段子节点 2')
// ])


/**** patch Portal ****/

const prevVNode = h(
	Portal,
	{
		target: '#old-container'
	},
	h('p', null, '旧的Portal')
)

const nextVNode = h(
	Portal,
	{
		target: '#new-container'
	},
	h('p', null, '新的Portal')
)

render(prevVNode, document.getElementById('app'))

// 2秒后更新
setTimeout(() => {
  render(nextVNode, document.getElementById('app'))
}, 2000)


