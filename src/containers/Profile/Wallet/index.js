/*
  Copyright 2017~2022 The Bottos Authors
  This file is part of the Bottos Data Exchange Client
  Created by Developers Team of Bottos.

  This program is free software: you can distribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Bottos. If not, see <http://www.gnu.org/licenses/>.
*/
import React,{PureComponent} from 'react'
import { connect } from 'react-redux'
// import {Wallet,Transfer,History} from './Person'
import { List, Button, Input, message } from 'antd';
import {Link} from 'react-router'
import './styles.less'
import {exportFile} from '../../../utils/BTUtil'
import BTIpcRenderer from '../../../tools/BTIpcRenderer'
import BTUnlogin from '../../../components/BTUnlogin'
import {FormattedMessage} from 'react-intl'
import messages from '../../../locales/messages'
import BTCointList from './subvies/BTCointList'
import CustomTabBar from '@/components/CustomTabBar'

const WalletMessages = messages.Wallet;


class BTWallet extends PureComponent {
    constructor(props){
        super(props)
        let currentAccount = props.account_info ? props.account_info.username : ''
        this.state = {
            walletList: [],
            accountList: [currentAccount],
            selectWallet: '',
            activeKey: '0',
        }
    }
    handleChange = (key) => {
      this.setState({
        activeKey: key,
        selectWallet: this.state.accountList[key]
      });
    }

    componentDidMount(){
        let props = this.props;
        if(props.location) {
            this.setLoginState(props.location.query.selectWallet)
        }else{
            this.setLoginState()
        }
    }

    setLoginState(username){
      const { account_info, isLogin } = this.props
      if (isLogin) {
        let walletList = BTIpcRenderer.getKeyStoreList()
        let accountList = []
        walletList.map(item=>{
          if(item.slice(item.length-9,item.length)=='.keystore'){
            accountList.push(item.slice(0,-9))
          }
        })
        let selectWallet = username ? username : account_info.username
        this.setState({
            selectWallet,
            walletList,
            accountList
        })
          // console.log(BTIpcRenderer.getKeyStore(username),selectWallet)
      }
    }

    checkWallet(item){
        this.setState({
            selectWallet:item.slice(0,-9)
        })
    }

    componentWillReceiveProps(nextProps){
      let selectWallet = nextProps.location.query.selectWallet
      let index = this.state.accountList.indexOf(selectWallet)
      this.setState({activeKey:index})
    }

    render() {
      const { children, isLogin } = this.props
      if ( React.isValidElement(children) ) {
        return children
      } else if (!isLogin) {
        return <div className="container center"><BTUnlogin /></div>
      }

      let checkedStyle = {backgroundColor:'rgb(154,125,224)'}
      let unCheckedStyle = {borderColor:'rgb(154,125,224)'}
      let walletListPath = {
          pathname:'/profile/wallet/walletlist',
          query:this.state.walletList
      }

      return (
        <div className='container column'>
          <CustomTabBar
            style={{position: 'relative'}}
            onChange={this.handleChange}
            keyMap={this.state.accountList}
            activeKey={this.state.activeKey}
          >
            <Link to={walletListPath}>
              <button className='wallet-management'>
                <FormattedMessage {...WalletMessages.More}/>>>>
              </button>
            </Link>
          </CustomTabBar>

          <BTCointList className="flex" selectWallet={this.state.selectWallet}/>
        </div>
      )


    }
}

const mapStateToProps = (state) => {
  const account_info = state.headerState.account_info
  const isLogin = account_info != null
  return { account_info, isLogin }
}

export default connect(mapStateToProps)(BTWallet)
