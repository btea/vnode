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

// Component
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
console.log(compVnode)

const funcVnode = h(MyFunctionalComponent)
console.log(funcVnode)
render(funcVnode, document.getElementById("app") || document.body);

