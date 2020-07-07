/* eslint-disable */
// const ABOUT_CONTENT = require('raw-loader!./about_zh.html');
import ABOUT_CONTENT from './about_zh.html';

export default {
  switch_lang: '切换语言',
  globe: '地球',
  map: '地图',
  token_view: '通证',
  about_view: '关于',
  login: '登录',
  logout: '登出',
  back: '后退',
  filter_country_or_region: '选择国家或地区',
  my_EOS: '我的EOS',
  my_CMU: '我的CMU',
  my_staked: '我的抵押',
  my_refund: '我的退款',
  my_refundtime :'退款等待时间',
  total_staked: '合计抵押',
  my_dividend: '我的分红',
  total_dividend: '合计分红',
  contract_supply: '合约发行量',
  contract_balance: '合约储备金',
  contract_price: '合约币价',

  payout_pool_tab: '红利池',
  my_assets_tab: '我的资产',
  stake_tab: '抵押',
  bancor_trade_tab: 'Bancor 交易',

  stake_btn: '抵押',
  unstake_btn: '取消抵押',
  refund_btn: '退还',
  buy_btn: '购买',
  sell_btn: '卖出',
  claim_btn: '领取分红',

  last_buyer: '最后的买家',
  count_down: '剩余时间',
  prize_pool: '奖池',
  ABOUT_CONTENT,

  cmu_creator: '由 Cryptomeetup（币聚）团队倾力打造',
  powered_by: 'Powered By',

  stake_number_alert: '你要抵押多少CMU？',
  stake_successful_alert: 'CMU 代币抵押成功',
  stake_pay_attention_alert: '稍后留意 My Staked',
  stake_confirmed_btn: '确认',
  unstake_alert: '你要撤销抵押多少 CMU ？',
  unstake_success: '撤销抵押成功',
  claim_success: '提取分红成功',
  wait_alert: '请耐心等待',
  claim_fail: '提取失败',
  buy_cmu_alert: '你要购买多少 EOS 等值的 CMU ？',
  buy_cmu_success_alert: 'CMU 代币购买成功',
  after_buy_cmu_alert: '稍后留意 CMU 余额变动',
  sell_cmu_alert: '你要卖出多少CMU？',
  ok: '好的',
  sell_cmu_success_alert: 'CMU 成功卖出',
  after_sell_cmu_alert: '稍后留意 EOS 余额变动',
  scatter_login_fail: 'Scatter 登入失败：用户的 Scatter 钱包已被锁定，在进行下一步之前用户已经被通知',
  scatter_login_success: '成功使用 Scatter 钱包登录',

  buy_land_withApp_success: '转账成功，30 秒内自动刷新数据，即可确认你是否为新地主。一切以区块链上交易记录为准，购买地皮失败则退款。',
  buy_land_success_alert: '成功购买',
  buy_land_success_msg: '转账已提交到区块链，30 秒后自动刷新数据，即可确认是否购买成功。',
  buy_land_success_comfm: '好的',
  
  token_FTextBubble:'如果您的股息余额大于零，您可以申请股息。',
  app_FTextBubble:'将 CMU 交换到 EOS',
  refund_FtextBubble:'退款将在一天后到达',
  
  input_title: '请输入地标名称',
  input_description: '请输入地标描述',
  input_nickname: '昵称',
  upload_photo: '上传地标图片',
  confirm_update: '确认',
  update_btn: '更新',

  state_review: '审核中',
  state_owned: '已拥有',
  state_unopened: '无领主',
  state_occupied: '已占领',
  invite: '邀请',

  create_portal: '创建地标', 
  create_portal_btn: '创建地标',
  server_error_alert: '服务器开小差了',
  fill_information_alert: '请填写完整地标信息',
  update_prefix: '更新',
  create_prefix: '创建',
  landmark_success_suffix: '地标成功',

  vote_btn: '投票',
  current_vote: '当前投票',
  vote_address: '投票地址',

  open_thermodynamic_chart: '打开热力图',
  close_thermodynamic_chart: '关闭热力图',

  buy_portal: '购买',
  buy_portal_error: '未在区块链中找到地标',
  buy_portal_success: '购买地标成功',

  my_portal_nav: '我的地标',
  my_portal_title: '我拥有的地标',
  my_portal_no_time: '暂无',
  my_portal_name: '名称',
  my_portal_des: '详情',
  my_portal_price: '价格',

  jackpot_income: '游戏收入',  
  share_income: '推荐返佣',
  create_portal_income: '手续费收入',

  my_portal_creator: '创建者',
  my_portal_owner: '拥有者',

  countryName: '{countryName}赞助者',
  newCountryName: '成为新的 {countryName}赞助者, 您需要支付 {price}',
  countryNameScatter: '使用Scatter桌面版进行支付',
  scatterDesktop: 'Scatter桌面版使支付更加便利、安全',
  noScatter: '无法检测到Scatter桌面版',
  wnlockScatter: '如果你想使用Scatter桌面版支付，请将其打开并解锁之后，刷新此页面。',
  useScatter: '如您尚无，请参阅：[How to use Scatter](https://support.newdex.io/hc/en-us/articles/360016322611-How-to-Use-Scatter-Desktop)',
  loginScatter: '使用Scatter登录后继续',
  scatterPay: '使用Scatter支付',
  scatterAppPay: '使用钱包APP支付',
  supportPay: '我们支持[Math Wallet](http://www.mathwallet.org/en/),[Token Pocket](https://www.mytokenpocket.vip/en/)and[MEET.ONE](http://meet.one/)扫码支付:',
  appPay: '在APP中进行支付',
  loginPay: '登录继续',
  appPayOk: '我已使用钱包APP完成支付',
  payClose: '关闭',
  loginSuccess: '登录成功',
  copy: '复制',
  sponsor: '赞助者',
  yuoBuy: '该国家由您向 @{owner}购买',
  priceNum: '支付{price} 成为新的赞助者',
  countryNameActivity: '{countryName}活动',
  noActivity: '暂无活动',
  checkIn: '登录',
  inviteFriends: '邀请伙伴获得奖励',
  online: '在线',
  offline: '离线',
  loginFailed: '用户名或密码错误'
};
