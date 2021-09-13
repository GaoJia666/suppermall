
import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {
    //2.判断oldProduct有没有值
    return new Promise((resolve,reject)=>{
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    if (oldProduct) {
      // oldProduct.count+=1
      context.commit(ADD_COUNTER, oldProduct)
      resolve('当前数量+1')
    } else {
      payload.count = 1
      context.commit(ADD_TO_CART, payload)
      resolve('添加了新的商品')
    }
    })
  }
}
