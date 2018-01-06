import React, {Component} from 'react';
import {parse, stringify} from 'qs';
import {connect} from 'dva';
import io from 'socket.io-client';
import '../assets/backend/css/common.css';
import {getConfig, getUserInfo, getCurrLottery} from '../services/mobile';
const socket = io('', {path: '/ws/chat'});
const adminSocket = io('', {path: '/ws/admin'});
import '../assets/wx/css/common.css';

class MobilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      no: 0,
    }
  }


  componentDidMount() {
    getUserInfo()
      .then(data => {
        if (data.success) {
          this.props.dispatch({
            type: 'wx/updateState',
            payload: {userinfo: data.result.userinfo},
          })
        } else {
          getConfig()
            .then(data => {
              if (data.success) {
                const HOME_PAGE = `http://${document.domain}/wx.html`
                const params = {
                  appid: data.result.appid,
                  redirect_uri: `http://${document.domain}/m/api/auth${location.search===""?"?hash=123":location.search}&callback=${HOME_PAGE}`,
                  //redirect_uri: `http://${document.domain}/mobile.html`,
                  response_type: 'code',
                  scope: 'snsapi_userinfo',
                  state: '1',
                }
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?${stringify(params)}#wechat_redirect`;
              }
            });
        }
      });
    this.getOpenNo();

    socket.emit('chat mounted', "--");
  }

  getOpenNo = () => {
    getCurrLottery()
      .then(data => {
        console.log(data, '==================no=========', data.result.lottery.no)
        if (data.success && data.result.lottery !== undefined) {
          const no = this.state.no;
          const currNo = parseInt(data.result.lottery.no);
          if (currNo === this.state.no) {
            //开奖，处理开奖逻辑
          }
          if (currNo > no) {
            //新登录用户，处理新登录逻辑
            this.setState({
              no: currNo + 1,
            })
          }
          if (currNo < no) {
            // 未开奖， 再次查询，去开奖
          }
        }
        //setTimeout(this.getOpenNo, 5000)
      });
  }


  handleOk = (data) => {
    dispatch({
      type: 'app/sign_in',
      payload: data,
    })
  }

  alterMessage = (message) => {
    this.props.dispatch({
      type: "mobile/updateState",
      payload: {message}
    })
  }

  render() {
    const {userinfo} = this.props.wx;
    return (
      <div>
        <div className="comTopDiv clf">
          <div className="fl">
            <a href="javascript:;">首页</a>
            <a href="javascript:;" className="membercolor">会员中心</a>
            <a href="javascript:;">￥:0.00</a>
          </div>
          <div className="fr">
            <a href="javascript:;">未结注单</a>
            <a href="javascript:;" className="message">信息(1)</a>
          </div>
        </div>
        <div className="content">
        {this.props.children}
        </div>
        <div className="comBotDiv">&copy;2018捷胜娱乐Casino版权所有</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {wx: state.wx};
}


export default connect(mapStateToProps)(MobilePage);
