import React from 'react';
import FieldContext from './FieldContext';

//实现双向数据绑定
//当input的值改变，把数据放到store上
class Field extends React.Component{

    static contextType = FieldContext;//通过this.context获取Provider中的value
    componentDidMount(){
        console.log(this.context)
        this.context.registerField(this);//把当前的组件，this注册到formStore中
    }
    onStoreChanged = ()=>{
        this.forceUpdate()
    }
    getControlled = (childProps)=>{
        let {getFieldValue,setFieldValue} = this.context;//FormInstance
        let {name} = this.props;
        return {
            ...childProps,
            value:getFieldValue(name),
            onChange:event=>{
                setFieldValue(name,event.target.value)
            }
        }
    }
    render(){
        let children = this.props.children;
        let child = React.cloneElement(children,this.getControlled(children.props))
        return child
    }
}

export default Field