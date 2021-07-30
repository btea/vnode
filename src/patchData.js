const domPropsRE = /\[A-Z]|^(?:value|checked|slected|muted)$/;
export default function patchData(el, key, prevValue, nextValue) {
    switch (key) {
        case 'style':
            // 如果 key 的值是 style，说明是内联样式，逐个将样式规则应用到 el
            for (let k in nextValue) {
                el.style[k] = nextValue[k];
            }
            // 遍历旧的 VNodeData ，将不存在于新的 VNodeData 中的样式清除
            for (let k in prevValue) {
                if (!nextValue || !nextValue.hasOwnProperty(k)) {
                    el.style[k] = '';
                }
            }
            break;
        case 'class':
            el.className = dynamicClass(nextValue[key]);
            break;
        default:
            // 事件处理
            if (key[0] === 'o' && key[1] === 'n') {
                // 移除旧事件
                if (prevValue) {
                    el.removeEventListener(key.slice(2), prevValue);
                }
                // 添加新事件
                if (nextValue) {
                    el.addEventListener(key.slice(2), nextValue);
                }
                // 注：如此一来，所有以 'on' 开头的属性都被判定为事件
            } else if (domPropsRE.test(key)) {
                // 当做 DOM Prop处理
                el[key] = nextValue;
            } else {
                // 当作 Attr 处理
                el.setAttribute(key, nextValue);
            }
            break;
    }
}
