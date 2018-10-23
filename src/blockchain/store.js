// 这个文件和 store 打交道
import store from '../store'

// trick: 延迟求值，因为 webpack 会直接处理初始为 undefined 的 `store`， 使用函数包裹此处可以绕过
export const currentState = () => store.state
export const currentGetters = () => store.getters

// 照样画葫芦
const account = () => currentGetters().account
const eos = () => currentState().eos
const rpc = () => currentState().rpc
const scatter = () => currentState().scatter

export { scatter, eos, rpc, account }
