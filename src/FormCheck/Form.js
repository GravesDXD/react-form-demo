import React from "react";
import FieldContext from "./FieldContext";
import useForm from './useForm';
/**
 *
 * @param {*} props
 * initialValue初始值
 * onFinish提交回调
 * @returns
 */
const Form = ({ initialValues, onFinish, children,onFinishFaild }) => {
  let [formInstance] = useForm();
  formInstance.setCallbacks({
    onFinish,
    onFinishFaild
  })
  const mountRef = React.useRef(null);
  console.log(mountRef,'mountRef')
  formInstance.setInitialValues(initialValues,mountRef.current);
  if(!mountRef.current){
    mountRef.current = true
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        formInstance.submit()
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  );
};

export default Form;
