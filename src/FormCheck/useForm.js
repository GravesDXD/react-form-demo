import React from "react";
import Schema from 'async-validator'
class FormStore {
  constructor(forceRerender) {
    this.forceRerender = forceRerender;
    this.store = {}; //存放表单对象
    this.callbacks = {};
    this.fieldsEntities = [];
  }
  getFieldValue = (name) => {
    return this.store[name] ? this.store[name] : '';
  };
  getFieldsValue = () => {
    return this.store;
  };
  setFieldValue = (name, val='') => {
    this.store[name] = val; //表单赋值
    this._notify()
  };
  _notify = ()=>{
    this.fieldsEntities.forEach(entity=>{
        entity.onStoreChanged()
    })
  }
  setFieldsValue = (newStore) => {
    this.store = { ...this.store, ...newStore }; //表单赋值
  };
  setInitialValues = (initialValues, mounted) => {
    console.log(this)
    if (!mounted) {
      this.store = { ...initialValues };
    }
  };
  vaidateFields = () => {
      let values =this.getFieldsValue();
      
      let descriptor = this.fieldsEntities.reduce((ins,entity)=>{
        let rules = entity.props.rules;
        console.log(entity.props,'===')
        if(Array.isArray(rules)){
            let config = rules.reduce((memo,rule)=>{
                memo = {...memo,...rule};
                return memo
            },{})
            ins[entity.props.name] = config;
            return ins
        }
      },{}) 
      return  new Schema(descriptor).validate(values)
  };
  registerField = (fieldsEntity) => {
      this.fieldsEntities.push(fieldsEntity);
    //   console.log(this)
  };
  submit = () => {
    this.vaidateFields()
      .then(() => {
        let { onFinish } = this.callbacks;
        onFinish && onFinish(this.store);
      })
      .catch((error) => {
        let { onFinishFailed } = this.callbacks;
        onFinishFailed && onFinishFailed(error);
      });
  };
  setCallbacks = (callbacks) => {
    this.callbacks = callbacks;
  };
  //隐藏私有方法
  getForm = () => {
    return {
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setCallbacks: this.setCallbacks,
      setInitialValues: this.setInitialValues,
      registerField:this.registerField,
      submit: this.submit,
    };
  };
}
//自定义hooks
export default function useForm(params) {
  let formRef = React.useRef(); //保持多次渲染的时候，返回的是同一个对象
  //强行重新渲染
  let [, forceUpdate] = React.useState({});
  if (!formRef.current) {
    //类似单例模式
    const forceRerender = () => {
      forceUpdate({}); //调用从方法重新刷新
    };
    let formStore = new FormStore(forceRerender);
    let formInstance = formStore.getForm();
    formRef.current = formInstance;
  }
  return [formRef.current];
}
