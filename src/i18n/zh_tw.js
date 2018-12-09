/* eslint-disable */
// const ABOUT_CONTENT = require('raw-loader!./about_zh.html');
import ABOUT_CONTENT from './about_zh_tw.html';

export default {
  switch_lang: '切換語言',
  globe: '地球',
  map: '地圖',
  token_view: '通證',
  about_view: '關於',
  login: '登錄',
  logout: '登出',
  back: '後退',
  filter_country_or_region: '選擇國家或地區',
  my_EOS: '我的EOS',
  my_CMU: '我的CMU',
  my_staked: '我的抵押',
  total_staked: '合計抵押',
  my_dividend: '我的分紅',
  total_dividend: '合計分紅',
  contract_supply: '合約發行量',
  contract_balance: '合約儲備金',
  contract_price: '合約幣價',

  payout_pool_tab: '紅利池',
  my_assets_tab: '我的資產',
  stake_tab: '抵押',
  bancor_trade_tab: 'Bancor 交易',

  stake_btn: '抵押',
  unstake_btn: '取消抵押',
  buy_btn: '購買',
  sell_btn: '賣出',
  claim_btn: '領取分紅',

  last_buyer: '最後的買家',
  count_down: '剩余時間',
  prize_pool: '獎池',
  ABOUT_CONTENT,

  cmu_creator: '由 Cryptomeetup（幣聚）團隊傾力打造',
  powered_by: 'Powered By',

  stake_number_alert: '妳要抵押多少CMU？',
  stake_successful_alert: 'CMU 代幣抵押成功',
  stake_pay_attention_alert: '稍後留意 My Staked',
  stake_confirmed_btn: '確認',
  unstake_alert: '妳要撤銷抵押多少 CMU ？',
  unstake_success: '撤銷抵押成功',
  claim_success: '提取分紅成功',
  wait_alert: '請耐心等待',
  claim_fail: '提取失敗',
  buy_cmu_alert: '妳要購買多少 EOS 等值的 CMU ？',
  buy_cmu_success_alert: 'CMU 代幣購買成功',
  after_buy_cmu_alert: '稍後留意 CMU 余額變動',
  sell_cmu_alert: '妳要賣出多少CMU？',
  ok: '好的',
  sell_cmu_success_alert: 'CMU 成功賣出',
  after_sell_cmu_alert: '稍後留意 EOS 余額變動',
  scatter_login_fail: 'Scatter 登入失敗：用戶的 Scatter 錢包已被鎖定，在進行下壹步之前用戶已經被通知',
  scatter_login_success: '成功使用Scatter錢包登錄',

  buy_land_withApp_success: '轉賬成功，30 秒內自動刷新數據，即可確認妳是否為新地主。壹切以區塊鏈上交易記錄為準，購買地皮失敗則退款。',
  buy_land_success_alert: '成功購買',
  buy_land_success_msg: '轉賬已提交到區塊鏈，30秒後自動刷新數據，即可確認是否購買成功。',
  buy_land_success_comfm: '好的',
  
  token_FTextBubble:'如果您的股息余額大於零，您可以申請股息。',
  app_FTextBubble:'將CMU交換到EOS',
  
  input_title: '請輸入地標名稱',
  input_description: '請輸入地標描述',
  input_nickname: '昵稱',
  upload_photo: '上傳地標圖片',
  confirm_update: '確認',
  update_btn: '更新',

  state_review: '審核中',
  state_owned: '已擁有',
  state_unopened: '無領主',
  state_occupied: '已占領',
  invite: '邀請',

  create_portal: '創建地標',
  create_portal_btn: '創建地標',
  server_error_alert: '服務器開小差了',
  fill_information_alert: '請填寫完整地標資訊',
  update_prefix: '更新',
  create_prefix: '創建',
  landmark_success_suffix: '地標成功',

  vote_btn: '投票',
  current_vote: '當前投票',
  vote_address: '投票地址',

  open_thermodynamic_chart: '打開熱力圖',
  close_thermodynamic_chart: '關閉熱力圖',

  buy_portal: '購買地標',
  buy_portal_error: '智慧合約未找到此地標',
  buy_portal_success: '購買地標成功',

  my_portal_nav: '我的地標',
  my_portal_title: '我擁有的地標',
  my_portal_no_time: '暫無',
  my_portal_name: '名稱',
  my_portal_des: '詳情',
  my_portal_price: '價格',

  // 以下修改确认，确认后请删除这条注释
  portal_income: '地產收入',
  share_income: '推薦收入',
  create_portal_income: '創建收入',
  jackpot_income: '獎池收入',

  my_portal_creator: '地標創建者',
  my_portal_owner: '地標擁有者',
};