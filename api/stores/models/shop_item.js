const { User, ShopItem } = require('###/models')

async function buy_shop_item(user_id, item_id) {
  const item = await ShopItem.findOne({ where: { id: item_id } })
  
  switch (item.type) {
    case 'ticket':
      const user = await User.findOne({ where: { id: user_id } })
      user.ticket += item.quantity
      await user.save()
      break
    
    default:
      throw new Error('Item does not exist')
  }
}

module.exports = { buy_shop_item }