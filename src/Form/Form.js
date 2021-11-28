import "./style.css";
import * as React from "react";
import FormField from './FormField'
import FormStoreContext from "./FormStoreContext";
import FormOptionsContext from "./FormOptionsContext";
function Form(props) {
  const { className = "", children, store, onSubmit, ...options } = props;

  const classNames = "rh-form " + className;
  return (
    <FormStoreContext.Provider value={store}>
      <FormOptionsContext.Provider value={options}>
        <form className={classNames} onSubmit={onSubmit}>
          {children}
        </form>
      </FormOptionsContext.Provider>
    </FormStoreContext.Provider>
  );
}

Form.Field = FormField
export default Form;
