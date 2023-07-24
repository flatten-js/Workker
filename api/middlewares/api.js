const { UserRate, Rate } = require('###/models')

const user_id = 1

const RATE_PLACE_ID = 1

async function accessAPI(rate_id, req, res, next) {
  const rate = await UserRate.findOne({ 
    where: { user_id, rate_id },
    include: [
      { model: Rate, required: true }
    ] 
  })

  if (rate) {
    const dt = new Date(rate.updatedAt)
    if (dt <= Date.now() - (1000 * 60 * 60 * 24)) {
      await UserRate.update({ count: 1 }, { where: { id: rate.id } })
      rate.count = 0
    }
    
    if (rate.count >= rate.Rate.limit) {
      return res.status(403).send('API rate limitation has been imposed.')
    }

    await UserRate.update({ count: rate.count+1 }, { where: { id: rate.id } })
  } else {
    await UserRate.create({ rate_id, user_id, count: 1 })
  }
  
  next()
}

module.exports = { RATE_PLACE_ID, accessAPI }