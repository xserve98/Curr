import React, {Component} from 'react';
import {Router, Route, IndexRoute, hashHistory, Link} from 'react-router';
import '../../assets/backend/css/dataGather.css'
import {getAllLotterys} from '../../services/stat';
import Paging from '../../components/paging/Paging'
/**
 * Created by sven on 2017/8/4.
 */

export default class DataGather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: {data: []},
      type: this.props.location.state.type,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state.type !== this.state.type) {
      this.queryLotteryRecords(1, 10, nextProps.location.state.type);
    }
  }

  componentDidMount() {
    this.queryLotteryRecords(1, 10,  this.props.location.state.type)
  }

  queryLotteryRecords(currPage, pageSize, type) {
    type = type === undefined ? this.state.type : type
    getAllLotterys({pageSize, currPage, type, no: this.state.no})
      .then(data => {
        if (data.success) {
          this.setState({
            records: data.result,
            type
          });
        } else {
          this.setState({
            type
          })
        }
      })
  }

  queryLotteryRecordsByDate() {
    this.queryLotteryRecords(1, 10)
  }

  onNoInputChange(e) {
    this.setState({
      no: e.target.value.trim(),
    })
  }

  render() {
    return (
      <div className="r_aside">
        <div className="position">
          <span>数据采集</span>
        </div>
        <section className="mainBox clearfloat">
          <div className="search">
            <input type="text" placeholder="请输入开奖期号"
                   value={this.state.no} onChange={this.onNoInputChange.bind(this)}/>
            <button type="button" onClick={this.queryLotteryRecordsByDate.bind(this)}>搜索</button>
          </div>
          <table cellSpacing="0" cellPadding="0" style={{ width:"100%"}}>
            <thead>
            <tr>
              <th width="120">类型</th>
              <th width="120">期号</th>
              <th width="230">开奖号码</th>
              <th width="430">开奖时间</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.records.data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.type}</td>
                    <td>{item.no}</td>
                    <td>{item.code}</td>
                    <td>{item.opentime}</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
          <Paging
            currPage={this.state.records.currPage}
            pageSize={this.state.records.pageSize}
            total={this.state.records.total}
            callBack={this.queryLotteryRecords.bind(this)}
          />
        </section>
      </div>
    );
  }
}


