import { compile, parse } from '@vue/compiler-dom';
import { generate } from '@vue/compiler-core';
import { h } from './h';
import { render } from './render';

const str = `
    <div class="abc">
        <h1 :title="til"></h1>
        <div v-for="item in list" :key="item.id">{{item.name}}</div>
        <input type="text" />
    </div>
`;
const ast = parse(str);
const code = generate(ast);
console.log(code);
