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
// class MyComponent{
// 	render(){
// 		return h(
// 			'div',
// 			{
// 				style: {
// 					background: 'green'
// 				}
// 			},
// 			[
// 				h('span', null, '我是组件标题1·······'),
// 				h('span', null, '我是组件标题2······')
// 			]
// 		)
// 	}
// }
// 函数式组件
// function MyFunctionalComponent(){
// 	return h(
// 		'div',
// 		{
// 			style: {
// 				background: 'aqua',
// 				height: '100px',
// 				width: '100px',
// 				borderRadius: '50px',
// 				textAlign: 'center'
// 			}
// 		},
// 		[
// 			h('span', null, '我是组件标题1······'),
// 			h('span', null, '我是组件标题2······')
// 		]
// 	)
// }
// const compVnode = h(MyComponent)

// const funcVnode = h(MyFunctionalComponent)

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

// const prevVNode = h(
// 	Portal,
// 	{
// 		target: '#old-container'
// 	},
// 	h('p', null, '旧的Portal')
// )

// const nextVNode = h(
// 	Portal,
// 	{
// 		target: '#new-container'
// 	},
// 	h('p', null, '新的Portal')
// )

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)


// 组件类
class MyComponent {
	constructor(){
		this.localState = 'one'
	}
	// localState = 'one'
  
	mounted() {
	  	setTimeout(() => {
			this.localState = 'two'
			this._update()
	  	}, 2000)
	}
  
	render() {
	  	return h('div', null, this.localState)
	}
  }
// 有状态组件 VNode
// const compVNode = h(MyComponent)


/****    $props   ****/
// class ChildComponent{
// 	render() {
// 		// 通过 this.$props.text访问外部数据
// 		return h('div', null, this.$props.text)
// 	}
// }
// class ParentComponent{
// 	// localState = 'one'
// 	constructor(){
// 		this.localState = 'one'
// 	}

// 	render() {
// 		const childCompVNode = h(ChildComponent, {
// 			text: this.localState
// 		})
// 		return childCompVNode
// 	}
// }

// const compVNode = h(ParentComponent)


/****    被动更新    ****/
// 被动更新指的是由外部状态变化而引起的更新操作，通常父组件自身状态的变化可能会引起子组件的更新，
// class ChildComponent{
// 	render() {
// 		return h('div', null, this.$props.text)
// 	}
// }
// class ParentComponent{
// 	constructor(){
// 		this.localState = 'one'
// 	}

// 	mounted() {
// 		setTimeout(() => {
// 			this.localState = 'two'
// 			this._update()
// 		}, 2000)
// 	}

// 	render() {
// 		const childCompVNode = h(ChildComponent, {
// 			text: this.localState
// 		})
// 		console.log(childCompVNode)
// 		return childCompVNode
// 	}
// }
// const compVNode = h(ParentComponent)


/****   替换子组件   ****/
// class Component1{
// 	render() {
// 		return h('div', null, '这是组件1')
// 	}
// }
// class Component2{
// 	render() {
// 		return h('div', null, '这是组件2')
// 	}
// }
// class ParentComponent{
// 	constructor() {
// 		this.isTrue = true
// 	}
// 	mounted() {
// 		setTimeout(() => {
// 			this.isTrue = false
// 			this._update()
// 		}, 2000)
// 	}
// 	render() {
// 		return this.isTrue ? h(Component1) : h(Component2)
// 	}
// }
// const compVNode = h(ParentComponent)


/****   函数式组件更新    ****/
// 子组件----函数式组件
function MyFunctionalCom(props) {
	return h('div', null, props.text)
}
// 父组件的 render 函数中渲染了 MyFunctionalCom 子组件
class ParentComponent{
	constructor() {
		this.localState = 'one'
	}
	mounted() {
		setTimeout(() => {
			this.localState = 'two'
			this._update()
		}, 2000)
	}
	render() {
		return h(MyFunctionalCom, {
			text: this.localState
		})
	}
}
const compVNode = h(ParentComponent)
render(compVNode, document.getElementById('app'))


