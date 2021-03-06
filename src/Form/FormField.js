import * as React from "react";

import FormStoreContext from "./FormStoreContext";
import useFieldChange from "./useFieldChange";
import FormOptionsContext from "./FormOptionsContext";
import { getPropName, getValueFromEvent } from "./utils";

export default function FormField(props) {
  const {
    className,
    label,
    name,
    valueProp = "value",
    valueGetter = getValueFromEvent,
    suffix,
    children,
    ...restProps
  } = props;
  const store = React.useContext(FormStoreContext);
  const options = React.useContext(FormOptionsContext);
  const [value, setValue] = React.useState(
    name && store ? store.get(name) : undefined
  );
  console.log(value,'====value',name, store.get(name))
  const [error, setError] = React.useState(
    name && store ? store.error(name) : undefined
  );
  const onChange = React.useCallback(
    (...args) => name && store && store.set(name, valueGetter(...args)),
    [name, store, valueGetter]
  );
  console.log(onChange,'onchange')
  useFieldChange(store, name, () => {
    setValue(store ? store.get(name || "") : "");
    setError(store ? store.error(name || "") : "");
  });
  const { inline, compact, required, labelWidth, gutter, errorClassName } = {
    ...options,
    ...restProps,
  };
  let child = children;
  if (name && store && React.isValidElement(child)) {
    const prop = getPropName(valueProp, child && child.type);
    const childProps = { [prop]: value, onChange };
    console.log(childProps,'childprops')
    child = React.cloneElement(child, childProps);
  }
  const headerStyle = {
    width: labelWidth,
    marginRight: gutter,
  };
  const classNames = [
    classes.field,
    inline ? classes.inline : "",
    compact ? classes.compact : "",
    required ? classes.required : "",
    error ? classes.error : "",
    className ? className : "",
    error ? errorClassName : "",
  ].join("");
  return (
    <FormStoreContext.Consumer>
      {(store) => {
        console.log(store, "===============");
        return (
          <FormOptionsContext.Consumer>
            {(options) => {
                console.log(options)
              return (
                <div className={classNames}>
                  {label !== undefined && (
                    <div className={classes.header} style={headerStyle}>
                      {label}
                    </div>
                  )}
                  <div className={classes.container}>
                    <div className={classes.control}>{child}</div>
                    <div className={classes.message}>{error}</div>
                  </div>
                  {suffix !== undefined && (
                    <div className={classes.footer}>{suffix}</div>
                  )}
                </div>
              );
            }}
          </FormOptionsContext.Consumer>
        );
      }}
    </FormStoreContext.Consumer>
  );
}

const classes = {
  field: "rh-form-field ",
  inline: "rh-form-field--inline ",
  compact: "rh-form-field--compact ",
  required: "rh-form-field--required ",
  error: "rh-form-field--error ",
  header: "rh-form-field__header",
  container: "rh-form-field__container",
  control: "rh-form-field__control",
  message: "rh-form-field__message",
  footer: "rh-form-field__footer",
};
