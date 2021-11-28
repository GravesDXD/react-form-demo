import logo from "./logo.svg";
import "./App.css";
// import { Form, FormStore } from "./Form/index";
import Form, { Field } from "./FormCheck";
import { Button } from "antd";
function App() {
  return (
    <div className="App">
      {/* <Button type="primary">Button</Button> */}
      <Form
        onFinish={(val) => {
          console.log(val);
        }}
        onFinishFaild={(errorInfo) => {
          console.log("error", errorInfo);
        }}
      >
        <Field name="user" rules={[{ required: true }]}>
          <input />
        </Field>
        <Button htmlType="submit">提交</Button>
      </Form>
    </div>
  );
}

export default App;
